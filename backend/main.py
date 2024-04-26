
from fastapi import FastAPI
from fastapi.responses import  StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from models import VideoAnalysisRequest
from services.genai import (
    YoutubeProcessor,
    GeminiProcessor
)
import logging
import asyncio
from sse_starlette.sse import EventSourceResponse

# Configure log
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
MESSAGE_STREAM_RETRY_TIMEOUT = 20
MESSAGE_STREAM_DELAY = 10

app = FastAPI()
origins = ["https://youtube-flashcards-ecztinewf-sqb101gmailcoms-projects.vercel.app","http://localhost:5173", "http://localhost","http://127.0.0.1:5173", "http://127.0.0.1", "http://localhost:8000", "http://localhost", "https://youtube-flashcards-nmpds37be-sqb101gmailcoms-projects.vercel.app", "https://youtube-flashcards.vercel.app"]
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Initiate GenAI processor
genai_processor = GeminiProcessor(
        model_name = "gemini-pro",
        project = "video-summarizer-421310"
    )
STREAM_DELAY = 2  # second
RETRY_TIMEOUT = 15000  # milisecond
@app.get("/test-stream/{video_id}")
async def stream_analyze_video(video_id):
    # Youtube link
    yt_link = "https://www.youtube.com/watch?v="+video_id
    # Doing the analysis
    processor = YoutubeProcessor(genai_processor = genai_processor)
    result = processor.retrieve_youtube_documents(yt_link, verbose=False)
    
    #summary = genai_processor.generate_document_summary(result, verbose=True)
    
    # Find key concepts
    raw_concepts = processor.find_key_concepts_as_stream(result, verbose=True)
    async def event_generator():
        for s in raw_concepts:
            
            # # Deconstruct
            # unique_concepts = {}
            # for concept_dict in s:
            #     for key, value in concept_dict.items():
            #         unique_concepts[key] = value
            
            # # Reconstruct
            # key_concepts_list = [{key: value} for key, value in unique_concepts.items()]
            yield {
                        "event": "message",
                        "id": "message_id",
                        "retry": RETRY_TIMEOUT,
                        "data": s
                }
            await asyncio.sleep(STREAM_DELAY)
        yield {
                    "event": "end_event",
                    "id": "message_id",
                    "retry": RETRY_TIMEOUT,
                    "data": ""
        }
    
    return EventSourceResponse(event_generator(), media_type="text/event-stream")

@app.post("/analyze_video")
def analyze_video(request: VideoAnalysisRequest):
    # Doing the analysis
    processor = YoutubeProcessor(genai_processor = genai_processor)
    result = processor.retrieve_youtube_documents(str(request.youtube_link), verbose=False)
    
    #summary = genai_processor.generate_document_summary(result, verbose=True)
    
    # Find key concepts
    raw_concepts = processor.find_key_concepts(result, verbose=True)
    
    # Deconstruct
    unique_concepts = {}
    for concept_dict in raw_concepts:
        for key, value in concept_dict.items():
            unique_concepts[key] = value
    
    # Reconstruct
    key_concepts_list = [{key: value} for key, value in unique_concepts.items()]
    
    return {
        "key_concepts": key_concepts_list
    }

@app.post("/video_metadata")
def analyze_video(request: VideoAnalysisRequest):
    from langchain_community.document_loaders import YoutubeLoader
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    
    loader = YoutubeLoader.from_youtube_url(str(request.youtube_link), add_video_info=True)
    docs = loader.load()
    
    print("On load: ", type(docs))
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap = 0)
    result = text_splitter.split_documents(docs)
    
    print(f"{type(result)}")
    
    author = result[0].metadata['author']
    length = result[0].metadata['length']
    title = result[0].metadata['title']
    total_size = len(result)
    
    return{
        'author':author,
        'length':length,
        'title':title,
        'total_size':total_size
    }

@app.post("/summarize_video")
def summarize_video(request: VideoAnalysisRequest):
     # Doing the summarization
    processor = YoutubeProcessor(genai_processor = genai_processor)
    result = processor.retrieve_youtube_documents(str(request.youtube_link), verbose=False)
    summary = genai_processor.generate_document_summary(result)
    return{'summary':summary}
    
    
        
# Check health of backend connection
@app.get("/root")
def health():
    return {"status":"ok"}


