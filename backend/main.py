from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/submit")
async def submit_email(email: str = Form(...)):
    os.makedirs('/app/data', exist_ok=True)
    emails = []
    if os.path.exists('/app/data/emails.txt'):
        with open('/app/data/emails.txt', 'r') as f:
            emails = f.readlines()
        emails = [e.strip() for e in emails]
    
    if email in emails:
        return JSONResponse(content={"message": "Email already exists!"}, status_code=400)
    
    with open('/app/data/emails.txt', 'a') as f:
        f.write(email + '\n')
    return JSONResponse(content={"message": "Email saved!"}, status_code=200)

@app.get("/emails")
async def get_emails():
    emails = []
    if os.path.exists('/app/data/emails.txt'):
        with open('/app/data/emails.txt', 'r') as f:
            emails = f.readlines()
    emails = [email.strip() for email in emails]
    return JSONResponse(content={"emails": emails}, status_code=200)
