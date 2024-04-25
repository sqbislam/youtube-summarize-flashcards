from pydantic import BaseModel, HttpUrl


class VideoAnalysisRequest(BaseModel):
    youtube_link: HttpUrl
    # advanced settings