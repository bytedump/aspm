from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

app = FastAPI(title="Shield Tech API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

alerts_db = [
    {
        "id": 1, "source_tool": "trivy", "repository": "shield-tech/auth-service",
        "severity": "CRITICAL", "severity_adjusted": "CRITICAL",
        "title": "Unsafe SQL String Concatenation", "file_path": "auth/db.py",
        "line_number": 45, "created_at": datetime.now().isoformat()
    },
    {
        "id": 2, "source_tool": "semgrep", "repository": "shield-tech/client-app",
        "severity": "HIGH", "severity_adjusted": "HIGH",
        "title": "Exposed Secret Token", "file_path": "config/settings.js",
        "line_number": 12, "created_at": datetime.now().isoformat()
    },
    {
        "id": 3, "source_tool": "trivy", "repository": "shield-tech/client-app",
        "severity": "MEDIUM", "severity_adjusted": "MEDIUM",
        "title": "Outdated React Version", "file_path": "package.json",
        "line_number": 1, "created_at": datetime.now().isoformat()
    },
    {
        "id": 4, "source_tool": "semgrep", "repository": "cloud-deployment",
        "severity": "HIGH", "severity_adjusted": "HIGH",
        "title": "Open S3 Bucket Permissions", "file_path": "terraform/storage.tf",
        "line_number": 42, "created_at": datetime.now().isoformat()
    },
    {
        "id": 5, "source_tool": "trivy", "repository": "shield-tech/auth-service",
        "severity": "LOW", "severity_adjusted": "LOW",
        "title": "Information Disclosure in Headers", "file_path": "auth/middleware.py",
        "line_number": 88, "created_at": datetime.now().isoformat()
    },
    {
        "id": 6, "source_tool": "semgrep", "repository": "shield-tech/auth-service",
        "severity": "INFO", "severity_adjusted": "INFO",
        "title": "Missing rate limiting", "file_path": "auth/routes.py",
        "line_number": 23, "created_at": datetime.now().isoformat()
    },
    {
        "id": 7, "source_tool": "trivy", "repository": "cloud-deployment",
        "severity": "CRITICAL", "severity_adjusted": "CRITICAL",
        "title": "Unrestricted SSH Access (Port 22)", "file_path": "terraform/security-groups.tf",
        "line_number": 15, "created_at": datetime.now().isoformat()
    }
]

class LoginReq(BaseModel):
    email: str
    password: str

class SignupReq(BaseModel):
    email: str
    password: str
    company_name: str

@app.post("/api/auth/login")
def login(req: LoginReq):
    if req.email == "admin@shieldtech.io" and req.password == "admin123":
        return {"access_token": "fake-jwt-token", "api_key": "fake-api-key", "company_name": "Shield Tech"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/auth/signup")
def signup(req: SignupReq):
    return {"access_token": "fake-jwt-token", "api_key": "fake-api-key", "company_name": req.company_name}

@app.get("/api/auth/me")
def get_me():
    return {"email": "admin@shieldtech.io", "company_name": "Shield Tech"}

@app.get("/api/alerts")
def get_alerts(severity: Optional[str] = None, source_tool: Optional[str] = None):
    res = alerts_db
    if severity and severity != "TODAS":
        res = [a for a in res if a["severity_adjusted"] == severity]
    if source_tool and source_tool != "TODAS":
        res = [a for a in res if a["source_tool"] == source_tool]
    return res

@app.get("/api/stats")
def get_stats():
    return {
        "total_alerts": len(alerts_db),
        "by_severity": {
            "CRITICAL": len([a for a in alerts_db if a["severity_adjusted"] == "CRITICAL"]),
            "HIGH": len([a for a in alerts_db if a["severity_adjusted"] == "HIGH"]),
            "MEDIUM": len([a for a in alerts_db if a["severity_adjusted"] == "MEDIUM"]),
            "LOW": len([a for a in alerts_db if a["severity_adjusted"] == "LOW"]),
        }
    }
