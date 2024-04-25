
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from models import VideoAnalysisRequest
from services.genai import (
    YoutubeProcessor,
    GeminiProcessor
)



app = FastAPI()
origins = ["http://localhost:5173", "http://localhost","http://127.0.0.1:5173", "http://127.0.0.1", "http://localhost:8000", "http://localhost"]
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

@app.post('/analyze_video')
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
    result = processor.retrieve_youtube_documents(str(request.youtube_link), verbose=True)
    summary = genai_processor.generate_document_summary(result)
    return{'summary':summary}
    
    
        
# Check health of backend connection
@app.get("/root")
def health():
    return {"status":"ok"}


