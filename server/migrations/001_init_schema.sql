-- =============================================================================
-- 《唐宋山河诗境》PostgreSQL 核心数据库架构定义
-- 版本: v1.0.0 (高扩展性设计)
-- 特性: 
--   1. 统一采用 JSONB 存储半结构化数据 (五维心境、分支抉择、挖空错题、动态配置)
--   2. 全实体预留 metadata/attributes 字段，后续功能扩充无需破坏性 DDL 修改
--   3. 全表配备自动 updated_at 触发器与关键业务外键索引 / GIN 倒排索引
-- =============================================================================

-- 开启扩展 (如需 UUID 生成)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 通用自动更新 updated_at 触发器函数
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- -----------------------------------------------------------------------------
-- 1. 用户账户与雅士身份表 (users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,                       -- 如 'usr_1699999' 或 自定义账号
    username VARCHAR(64) UNIQUE NOT NULL,             -- 登录账号
    password_hash VARCHAR(255) NOT NULL,              -- 密码哈希 (Argon2 / Bcrypt)
    pen_name VARCHAR(64) NOT NULL,                   -- 文人雅号 (如 '三尚', '青莲墨客')
    avatar_icon VARCHAR(64) DEFAULT '📜',             -- 个人头像/印章符号
    rank_title VARCHAR(32) DEFAULT '童生初入',        -- 文位阶梯
    level INT DEFAULT 1,                              -- 等级
    exp BIGINT DEFAULT 100,                           -- 经验值
    status VARCHAR(32) DEFAULT 'active',              -- 'active', 'muted', 'archived'
    preferences JSONB DEFAULT '{"theme": "spring", "sound": true, "volume": 0.8}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,               -- 预留扩展: 头衔徽章、个性印章配置等
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- -----------------------------------------------------------------------------
-- 2. 文人主表 (poets)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS poets (
    id VARCHAR(64) PRIMARY KEY,                       -- 'li_bai', 'du_fu', 'su_shi', 'li_qingzhao'
    name VARCHAR(64) NOT NULL,                        -- 姓名
    dynasty VARCHAR(32) NOT NULL,                     -- 'tang' | 'song'
    courtesy_name VARCHAR(64),                        -- 字
    art_name VARCHAR(64),                             -- 号
    title VARCHAR(128) NOT NULL,                      -- 尊号 (如: "诗仙", "诗圣")
    birth_year INT NOT NULL,                          -- 生年
    death_year INT NOT NULL,                          -- 卒年
    birth_place VARCHAR(128) NOT NULL,                -- 籍贯
    avatar_url VARCHAR(512) NOT NULL,                 -- 头像路径 / CDN URL
    portrait_url VARCHAR(512) NOT NULL,               -- 全幅长卷立绘
    quotes JSONB DEFAULT '[]'::jsonb,                 -- 传世名句
    biography TEXT NOT NULL,                          -- 生平叙述
    start_location_id VARCHAR(64) NOT NULL,           -- 游历起点城池
    start_year INT NOT NULL,                          -- 游历起始年份
    initial_mood JSONB NOT NULL,                      -- 初始五维心境 { passion, sorrow, freedom, anger, homesickness }
    attributes JSONB DEFAULT '{}'::jsonb,             -- 扩展属性: 文学流派、特质加成、性格倾向
    metadata JSONB DEFAULT '{}'::jsonb,               -- 扩展元数据: 专属配乐、长卷主题色等
    status VARCHAR(32) DEFAULT 'active',              -- 'active' | 'draft' | 'hidden'
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_poets_updated_at BEFORE UPDATE ON poets
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- -----------------------------------------------------------------------------
-- 3. 名城舆图坐标与风貌表 (locations)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS locations (
    id VARCHAR(64) PRIMARY KEY,                       -- 'chang_an', 'luo_yang', 'jin_ling'
    name VARCHAR(64) NOT NULL,                        -- 古代名城名
    modern_name VARCHAR(64) NOT NULL,                 -- 今地名
    dynasty VARCHAR(32) NOT NULL,                     -- 盛期朝代
    dynasty_names JSONB DEFAULT '{}'::jsonb,          -- 朝代古今地名映射: {"tang": "长安", "song": "京兆府"}
    lat DOUBLE PRECISION NOT NULL,                    -- 纬度
    lng DOUBLE PRECISION NOT NULL,                    -- 经度
    province VARCHAR(64) NOT NULL,                    -- 现代省份
    description TEXT NOT NULL,                        -- 人文地理阐释
    historical_importance VARCHAR(128) NOT NULL,      -- 文史地位标签
    specialty_artifact_id VARCHAR(64),                -- 产出风物特产
    scenery_tags JSONB DEFAULT '[]'::jsonb,           -- 地貌意象标签 (如: ["古驿道", "古刹", "临江"])
    metadata JSONB DEFAULT '{}'::jsonb,               -- 扩展: 专属环境音、瓦片样式
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_locations_updated_at BEFORE UPDATE ON locations
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- -----------------------------------------------------------------------------
-- 4. 传世名篇与推敲题库表 (poems)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS poems (
    id VARCHAR(64) PRIMARY KEY,                       -- 'shu_dao_nan', 'wang_yue'
    poet_id VARCHAR(64) NOT NULL REFERENCES poets(id) ON DELETE CASCADE,
    title VARCHAR(128) NOT NULL,                      -- 诗词标题
    dynasty VARCHAR(32) NOT NULL,                     -- 朝代
    year INT,                                         -- 创作公元年份
    location_id VARCHAR(64) REFERENCES locations(id) ON DELETE SET NULL,
    form VARCHAR(64) NOT NULL,                        -- 体裁: '七言古诗', '五言绝句', '词牌·念奴娇'
    background TEXT NOT NULL,                         -- 创作缘起与背景赏析
    paragraphs JSONB NOT NULL,                        -- 完整句列: ["噫吁嚱，危乎高哉！", "蜀道之难，难于上青天！"]
    blanks JSONB NOT NULL,                            -- 挖空题目数组: [{ lineIndex, charIndex, options, correct, explanation }]
    pedagogy JSONB DEFAULT '{}'::jsonb,               -- 教学与赏析扩展: 典故出处、平仄格律、名家点评
    tags JSONB DEFAULT '[]'::jsonb,                   -- 意象标签: ["蜀道", "豪放", "山川险绝"]
    audio_url VARCHAR(512),                           -- 诵读音频资源
    audio_config JSONB DEFAULT '{}'::jsonb,           -- 律吕伴听配置 (节奏、语速、高亮时间戳)
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_poems_poet_id ON poems(poet_id);
CREATE INDEX IF NOT EXISTS idx_poems_location_id ON poems(location_id);
CREATE INDEX IF NOT EXISTS idx_poems_tags ON poems USING GIN(tags);

CREATE TRIGGER trg_poems_updated_at BEFORE UPDATE ON poems
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- -----------------------------------------------------------------------------
-- 5. 人生年谱与重大分支抉择表 (poet_events)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS poet_events (
    id VARCHAR(64) PRIMARY KEY,
    poet_id VARCHAR(64) NOT NULL REFERENCES poets(id) ON DELETE CASCADE,
    year INT NOT NULL,                                -- 发生公元年份
    location_id VARCHAR(64) REFERENCES locations(id) ON DELETE SET NULL,
    title VARCHAR(128) NOT NULL,                      -- 纪事标题
    event_type VARCHAR(32) DEFAULT 'milestone',       -- 'milestone', 'creation', 'choice', 'crisis', 'encounter'
    historical_context TEXT,                          -- 时代大背景
    narrative TEXT NOT NULL,                          -- 沉浸式情境正文
    triggered_poem_id VARCHAR(64) REFERENCES poems(id) ON DELETE SET NULL,
    triggered_choice_id VARCHAR(64),
    triggered_encounter_id VARCHAR(64),
    choices JSONB DEFAULT '[]'::jsonb,                -- 历史抉择分支与心境变动
    mood_impact JSONB DEFAULT '{}'::jsonb,            -- 心境直接增减
    requirements JSONB DEFAULT '{}'::jsonb,           -- 触发前置条件 (如心境阈值、已完成事件)
    metadata JSONB DEFAULT '{}'::jsonb,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_poet_events_poet_year ON poet_events(poet_id, year);

CREATE TRIGGER trg_poet_events_updated_at BEFORE UPDATE ON poet_events
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- -----------------------------------------------------------------------------
-- 6. 山河风物与文人信物表 (artifacts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS artifacts (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,                        -- "太白青锋宝剑", "东坡笠屐"
    category VARCHAR(32) NOT NULL,                    -- 'weapon', 'tea_wine', 'stationery', 'relic', 'food'
    rarity VARCHAR(32) NOT NULL,                      -- 'legendary', 'epic', 'rare'
    description TEXT NOT NULL,
    historical_story TEXT,                            -- 文史考据出处
    icon VARCHAR(64),
    poet_exclusive_id VARCHAR(64) REFERENCES poets(id) ON DELETE SET NULL,
    city_origin_id VARCHAR(64) REFERENCES locations(id) ON DELETE SET NULL,
    buffs JSONB DEFAULT '{}'::jsonb,                  -- 装备/纳藏心境加成
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_artifacts_poet ON artifacts(poet_exclusive_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_city ON artifacts(city_origin_id);

CREATE TRIGGER trg_artifacts_updated_at BEFORE UPDATE ON artifacts
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- -----------------------------------------------------------------------------
-- 7. 千古相遇与文人同框羁绊表 (encounters)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS encounters (
    id VARCHAR(64) PRIMARY KEY,
    primary_poet_id VARCHAR(64) NOT NULL REFERENCES poets(id) ON DELETE CASCADE,
    secondary_poet_id VARCHAR(64) NOT NULL REFERENCES poets(id) ON DELETE CASCADE,
    year INT NOT NULL,
    location_id VARCHAR(64) REFERENCES locations(id) ON DELETE SET NULL,
    title VARCHAR(128) NOT NULL,                      -- 如 "日与月相撞 · 洛阳初遇"
    description TEXT,
    dialogues JSONB NOT NULL,                         -- 双人对坐分句长卷对白
    gift_poem_id VARCHAR(64) REFERENCES poems(id) ON DELETE SET NULL,
    bond_seal JSONB NOT NULL,                         -- 专属朱砂羁绊印鉴配置
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_encounters_updated_at BEFORE UPDATE ON encounters
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- -----------------------------------------------------------------------------
-- 8. 玩家游历多槽位存档表 (journey_saves)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS journey_saves (
    id VARCHAR(64) PRIMARY KEY,                       -- 'save_usr123_slot1'
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slot_index INT NOT NULL DEFAULT 1,                -- 槽位序号 (1, 2, 3...)
    slot_name VARCHAR(128) NOT NULL,                  -- 槽位自定义名 (如: "【档一】太白纵酒入长安")
    poet_id VARCHAR(64) NOT NULL REFERENCES poets(id),
    current_year INT NOT NULL,
    current_location_id VARCHAR(64) NOT NULL,
    mood JSONB NOT NULL,                              -- 实时五维心境
    unlocked_poem_ids JSONB DEFAULT '[]'::jsonb,      -- 已纳藏诗卷
    poem_scores JSONB DEFAULT '{}'::jsonb,            -- 诗篇评分
    unlocked_artifact_ids JSONB DEFAULT '[]'::jsonb,  -- 行囊风物
    unlocked_bond_ids JSONB DEFAULT '[]'::jsonb,      -- 相遇羁绊
    completed_event_ids JSONB DEFAULT '[]'::jsonb,    -- 已历经事件
    choices_made JSONB DEFAULT '{}'::jsonb,           -- 所做历史分支抉择
    journey_logs JSONB DEFAULT '[]'::jsonb,           -- 行履足迹大年表
    game_state JSONB DEFAULT '{}'::jsonb,             -- 自由引擎状态 (未来任何新增系统均可注入此字段)
    is_active BOOLEAN DEFAULT FALSE,                  -- 是否为当前正在游历的主槽位
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, slot_index)
);

CREATE INDEX IF NOT EXISTS idx_journey_saves_user ON journey_saves(user_id);

CREATE TRIGGER trg_journey_saves_updated_at BEFORE UPDATE ON journey_saves
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- -----------------------------------------------------------------------------
-- 9. 诗词推敲默写答卷表与错题集 (poem_study_records)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS poem_study_records (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    save_slot_id VARCHAR(64) REFERENCES journey_saves(id) ON DELETE SET NULL,
    poem_id VARCHAR(64) NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
    mode VARCHAR(32) DEFAULT 'assembly',              -- 'assembly' (推敲) | 'dictation' (默写) | 'recitation' (吟诵)
    score INT NOT NULL,                               -- 100 | 75 | 50
    grade VARCHAR(32) NOT NULL,                       -- '甲等·妙品' | '乙等·通达' | '丙等·尚可'
    duration_seconds INT NOT NULL,                    -- 耗时秒数
    mistakes JSONB DEFAULT '[]'::jsonb,               -- 错题集: [{ lineIndex, charIndex, chosenOption, correctOption, explanation }]
    extra_data JSONB DEFAULT '{}'::jsonb,
    completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_study_records_user ON poem_study_records(user_id);
CREATE INDEX IF NOT EXISTS idx_study_records_poem ON poem_study_records(poem_id);

-- -----------------------------------------------------------------------------
-- 10. 文心墨札笔记与行路随笔表 (poetry_notes)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS poetry_notes (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    poem_id VARCHAR(64) REFERENCES poems(id) ON DELETE SET NULL,
    poet_id VARCHAR(64) REFERENCES poets(id) ON DELETE SET NULL,
    location_id VARCHAR(64) REFERENCES locations(id) ON DELETE SET NULL,
    title VARCHAR(128) NOT NULL,                      -- 札记题头
    content TEXT NOT NULL,                            -- 正文随笔感悟
    tags JSONB DEFAULT '[]'::jsonb,                   -- 标签 (如: ["#名句赏析", "#东坡旷达"])
    bookmark_style JSONB DEFAULT '{}'::jsonb,         -- 水墨书签样式 (底纹、流苏、印鉴排版)
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_poetry_notes_user ON poetry_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_poetry_notes_tags ON poetry_notes USING GIN(tags);

CREATE TRIGGER trg_poetry_notes_updated_at BEFORE UPDATE ON poetry_notes
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
