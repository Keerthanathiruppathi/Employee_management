from logging.config import fileConfig
import os

from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy import pool

from alembic import context


# --------------------------------------------------
# Alembic Config
# --------------------------------------------------

config = context.config


# --------------------------------------------------
# Load environment variables
# --------------------------------------------------

load_dotenv()


# --------------------------------------------------
# Get DATABASE_URL from .env
# --------------------------------------------------

database_url = os.getenv("DATABASE_URL")

if not database_url:
    raise RuntimeError(
        "DATABASE_URL is not set. "
        "Please check the backend/.env file."
    )


# --------------------------------------------------
# Configure logging
# --------------------------------------------------

if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# --------------------------------------------------
# Import SQLAlchemy models
# --------------------------------------------------

from app.models import Base


# --------------------------------------------------
# Metadata for Alembic Autogenerate
# --------------------------------------------------

target_metadata = Base.metadata


# --------------------------------------------------
# Offline Migration
# --------------------------------------------------

def run_migrations_offline() -> None:
    """
    Run migrations in offline mode.

    This generates SQL without connecting
    directly to the database.
    """

    context.configure(
        url=database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={
            "paramstyle": "named"
        },
    )

    with context.begin_transaction():
        context.run_migrations()


# --------------------------------------------------
# Online Migration
# --------------------------------------------------

def run_migrations_online() -> None:
    """
    Run migrations in online mode.

    This connects directly to PostgreSQL
    using DATABASE_URL from .env.
    """

    connectable = create_engine(
        database_url,
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:

        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


# --------------------------------------------------
# Start Migration
# --------------------------------------------------

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()