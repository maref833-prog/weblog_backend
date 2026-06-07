from pydantic_settings import BaseSettings
class settings(BaseSettings):
    DATABASE_URL: str = "postgresql://myuser:aref9090@localhost:5432/blogdb"
    SECRET_KEY: str = "x+iQ^.a5zOZ#lXc>gpXUXe.ZZF{Yy9_pOVQt,OM^^|IWW[Fyev"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    class config:
        env_file=".env"
settings=settings()