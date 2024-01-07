-- 1-4 ani
UPDATE announcement
SET experience = '1-4'
WHERE experience IN ('mai putin de un an', 'un an', 'doi ani', 'trei ani', 'patru ani');

-- 5+ ani
UPDATE announcement
SET experience = '5+'
WHERE experience IN ('cinci ani', 'sase ani', 'sapte ani', 'opt ani', 'noua ani');

-- 10+ ani
UPDATE announcement
SET experience = '10+'
WHERE experience IN ('zece ani', 'cincisprezece ani', 'cincisprezece an');

-- 20+ ani
UPDATE announcement
SET experience = '20+'
WHERE experience IN ('douazeci de ani', 'douazeci si cinci de ani');

-- 30+ ani
UPDATE announcement
SET experience = '30+'
WHERE experience = 'mai mult de douazeci si cinci de ani';
