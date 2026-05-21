CREATE TABLE IF NOT EXISTS proposals (
    id TEXT PRIMARY KEY,
    project TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL,
    expected_update TEXT NOT NULL,
    owner TEXT NOT NULL,
    acknowledged BOOLEAN DEFAULT FALSE
);
