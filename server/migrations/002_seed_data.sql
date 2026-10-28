-- =============================================================================
-- 《唐宋山河诗境》002 初始数据种子脚本 (Seed Data)
-- 自动生成时间: 2026-10-28T10:27:04.560Z
-- 包含: 雅士用户、文人宗匠、名城舆图、传世诗篇、纪事分支、山河风物、千古相遇、游历存档与研学答卷
-- =============================================================================

-- 1. 雅士用户种子
INSERT INTO users (id, username, password_hash, pen_name, avatar_icon, rank_title, level, exp, status, preferences, metadata)
VALUES (
  'user_01',
  'qinglian_moke',
  '$argon2id$v=19$m=19456,t=2,p=1$mock_hash_for_dev_only',
  '青莲墨客',
  '🪶',
  '翰林学士',
  6,
  4200,
  'active',
  '{"theme":"spring","sound":true,"volume":0.8}'::jsonb,
  '{"sealStyle":"stone","sealType":"baiwen","sealChars":"青莲墨客印","stats":{"travelYears":42,"poemsStudied":14,"artifactsCollected":11,"notesCount":6},"createdAtText":"天宝元年仲春"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  pen_name = EXCLUDED.pen_name,
  rank_title = EXCLUDED.rank_title,
  level = EXCLUDED.level,
  exp = EXCLUDED.exp,
  metadata = EXCLUDED.metadata;

INSERT INTO users (id, username, password_hash, pen_name, avatar_icon, rank_title, level, exp, status, preferences, metadata)
VALUES (
  'user_02',
  'dongpo_friend',
  '$argon2id$v=19$m=19456,t=2,p=1$mock_hash_for_dev_only',
  '东坡客·佛印',
  '🍵',
  '进士及第',
  4,
  2600,
  'active',
  '{"theme":"spring","sound":true,"volume":0.8}'::jsonb,
  '{"sealStyle":"stone","sealType":"baiwen","sealChars":"东坡客·印","stats":{"travelYears":28,"poemsStudied":8,"artifactsCollected":6,"notesCount":3},"createdAtText":"元丰二年秋"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  pen_name = EXCLUDED.pen_name,
  rank_title = EXCLUDED.rank_title,
  level = EXCLUDED.level,
  exp = EXCLUDED.exp,
  metadata = EXCLUDED.metadata;

INSERT INTO users (id, username, password_hash, pen_name, avatar_icon, rank_title, level, exp, status, preferences, metadata)
VALUES (
  'user_guest',
  'guest_walker',
  '$argon2id$v=19$m=19456,t=2,p=1$mock_hash_for_dev_only',
  '江湖游子 (游客)',
  '🍂',
  '秀才',
  2,
  800,
  'active',
  '{"theme":"spring","sound":true,"volume":0.8}'::jsonb,
  '{"sealStyle":"stone","sealType":"baiwen","sealChars":"江湖游子印","stats":{"travelYears":10,"poemsStudied":3,"artifactsCollected":2,"notesCount":1},"createdAtText":"今日初入"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  pen_name = EXCLUDED.pen_name,
  rank_title = EXCLUDED.rank_title,
  level = EXCLUDED.level,
  exp = EXCLUDED.exp,
  metadata = EXCLUDED.metadata;

-- 2. 名城舆图坐标
INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'sichuan',
  '蜀地（江油）',
  '四川绵阳江油',
  'tang',
  '{"tang":"蜀地","song":"剑南道"}'::jsonb,
  31.78,
  104.73,
  '四川',
  '青莲居士故里，山川奇秀，少年李白在此仗剑去国，辞亲远游。',
  '天下名城',
  NULL,
  '["chang_an","yangzhou","lu_shan"]'::jsonb,
  '{"mapPosition":{"x":28,"y":55},"mood_on_arrive":{"freedom":10,"passion":10},"type":"city"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'chang_an',
  '长安',
  '陕西西安',
  'tang',
  '{"tang":"长安","song":"京兆府"}'::jsonb,
  34.34,
  108.94,
  '陕西',
  '大唐帝国的心脏，万国来朝。李白在此供奉翰林，名动京华，亦在此深感官场拘束。',
  '天下名城',
  NULL,
  '["sichuan","luoyang","yingyang"]'::jsonb,
  '{"mapPosition":{"x":42,"y":42},"mood_on_arrive":{"passion":15,"anger":5},"type":"city"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'luoyang',
  '洛阳',
  '河南洛阳',
  'tang',
  '{"tang":"东都洛阳","song":"河南府"}'::jsonb,
  34.62,
  112.45,
  '河南',
  '千年帝都，牡丹之城。公元744年，李白在此与年轻的杜甫首次相遇，诗坛双星交汇。',
  '天下名城',
  NULL,
  '["chang_an","yingyang","huanghelou"]'::jsonb,
  '{"mapPosition":{"x":52,"y":45},"mood_on_arrive":{"freedom":10,"homesickness":5},"type":"city"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'lu_shan',
  '庐山',
  '江西九江庐山',
  'tang',
  '{"tang":"庐山","song":"庐山"}'::jsonb,
  29.56,
  115.98,
  '江西',
  '飞瀑垂天，灵秀峻拔。青年李白在此挥就《望庐山瀑布》，豪情激荡三千尺。',
  '人文胜迹',
  NULL,
  '["huanghelou","xunyang","yangzhou"]'::jsonb,
  '{"mapPosition":{"x":62,"y":62},"mood_on_arrive":{"freedom":20,"passion":15},"type":"landmark"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'huanghelou',
  '黄鹤楼',
  '湖北武汉黄鹤楼',
  'tang',
  '{"tang":"黄鹤楼","song":"黄鹤楼"}'::jsonb,
  30.54,
  114.3,
  '湖北',
  '临长江之巨观。烟花三月，李白在此为挚友孟浩然壮行，碧空唯见长江流。',
  '人文胜迹',
  NULL,
  '["lu_shan","luoyang","baidicheng"]'::jsonb,
  '{"mapPosition":{"x":55,"y":58},"mood_on_arrive":{"freedom":15,"sorrow":10},"type":"landmark"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'yangzhou',
  '扬州',
  '江苏扬州',
  'tang',
  '{"tang":"扬州","song":"广陵"}'::jsonb,
  32.39,
  119.41,
  '江苏',
  '繁华胜地，夜月如霜。李白旅居扬州客舍染疾，清秋深夜写就传唱千古的《静夜思》。',
  '天下名城',
  NULL,
  '["lu_shan","jingxian","sichuan"]'::jsonb,
  '{"mapPosition":{"x":75,"y":50},"mood_on_arrive":{"homesickness":25,"sorrow":15},"type":"city"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'yingyang',
  '颍阳',
  '河南许昌颍阳',
  'tang',
  '{"tang":"颍阳","song":"颍桥"}'::jsonb,
  34.25,
  113.15,
  '河南',
  '李白与好友岑勋、元丹丘相聚高歌，痛饮千钟，挥毫写下千古第一劝酒长歌《将进酒》。',
  '天下名城',
  NULL,
  '["luoyang","chang_an","jingxian"]'::jsonb,
  '{"mapPosition":{"x":56,"y":46},"mood_on_arrive":{"passion":30,"freedom":20},"type":"city"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'jingxian',
  '泾县',
  '安徽宣城泾县桃花潭',
  'tang',
  '{"tang":"泾县桃花潭","song":"泾县"}'::jsonb,
  30.69,
  118.41,
  '安徽',
  '汪伦以“万家酒店、十里桃花”邀李白来游，临别踏歌相送，情深胜过桃花潭水。',
  '人文胜迹',
  NULL,
  '["yangzhou","yingyang","xunyang"]'::jsonb,
  '{"mapPosition":{"x":70,"y":58},"mood_on_arrive":{"freedom":15,"sorrow":10},"type":"landmark"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'baidicheng',
  '白帝城',
  '重庆奉节白帝城',
  'tang',
  '{"tang":"白帝城","song":"夔州白帝城"}'::jsonb,
  31.04,
  109.57,
  '重庆',
  '李白流放夜郎中途获赦，惊喜交加，顺江疾驰，一日还江陵，轻舟已过万重山。',
  '人文胜迹',
  NULL,
  '["huanghelou","sichuan"]'::jsonb,
  '{"mapPosition":{"x":38,"y":58},"mood_on_arrive":{"freedom":35,"passion":20},"type":"landmark"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'xunyang',
  '浔阳',
  '江西九江市区',
  'tang',
  '{"tang":"浔阳","song":"江州"}'::jsonb,
  29.72,
  115.99,
  '江西',
  '长江要冲，李白晚年卷入永王璘幕府，遭遇人生重创，后病卒于当涂。',
  '天下名城',
  NULL,
  '["lu_shan","jingxian","huangzhou"]'::jsonb,
  '{"mapPosition":{"x":64,"y":65},"mood_on_arrive":{"sorrow":20,"homesickness":15},"type":"city"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'hangzhou',
  '杭州',
  '浙江杭州西湖',
  'tang',
  '{"tang":"杭州","song":"临安/余杭"}'::jsonb,
  30.27,
  120.15,
  '浙江',
  '水光潋滟晴方好，山色空蒙雨亦奇。苏轼两度知杭州，疏浚西湖筑苏堤，政通人和。',
  '天下名城',
  NULL,
  '["yangzhou","huangzhou"]'::jsonb,
  '{"mapPosition":{"x":78,"y":62},"mood_on_arrive":{"freedom":25,"passion":15},"type":"city"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'huangzhou',
  '黄州',
  '湖北黄冈黄州区',
  'tang',
  '{"tang":"黄州","song":"齐安郡黄州"}'::jsonb,
  30.45,
  114.88,
  '湖北',
  '乌台诗案后苏轼被贬此地，躬耕东坡，夜游赤壁，写下《赤壁赋》与《定风波》，文心涅槃。',
  '人文胜迹',
  NULL,
  '["huanghelou","hangzhou","xunyang"]'::jsonb,
  '{"mapPosition":{"x":58,"y":60},"mood_on_arrive":{"freedom":35,"sorrow":-20},"type":"landmark"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'chengdu',
  '成都（锦官城）',
  '四川成都',
  'tang',
  '{"tang":"锦官城·成都","song":"成都府"}'::jsonb,
  30.67,
  104.06,
  '四川',
  '九天开出一安详。杜甫携家入蜀，在城西浣花溪畔营建草堂，写就《春夜喜雨》《茅屋为秋风所破歌》等千古名篇。',
  '天下名城',
  NULL,
  '["sichuan","baidicheng"]'::jsonb,
  '{"mapPosition":{"x":30,"y":58},"mood_on_arrive":{"freedom":25,"homesickness":15},"type":"city"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'kaifeng',
  '汴京（开封）',
  '河南开封',
  'tang',
  '{"tang":"汴州","song":"东京汴梁"}'::jsonb,
  34.79,
  114.34,
  '河南',
  '大宋极盛帝都，清明上河图之锦绣繁华。李清照与赵明诚在此结缡，金石考据，风雅绝伦。',
  '天下名城',
  NULL,
  '["luoyang","jinan","yangzhou"]'::jsonb,
  '{"mapPosition":{"x":55,"y":44},"mood_on_arrive":{"passion":25,"freedom":15},"type":"city"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'taishan',
  '泰山',
  '山东泰安泰山',
  'tang',
  '{"tang":"岱宗泰山","song":"泰山"}'::jsonb,
  36.25,
  117.1,
  '山东',
  '五岳之首，拔地通天。青年杜甫游历齐赵，登临绝顶，极目青未了，抒发“会当凌绝顶，一览众山小”的博大胸襟。',
  '人文胜迹',
  NULL,
  '["jinan","luoyang"]'::jsonb,
  '{"mapPosition":{"x":68,"y":38},"mood_on_arrive":{"passion":35,"freedom":25},"type":"landmark"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'jinan',
  '济南',
  '山东济南',
  'tang',
  '{"tang":"齐州","song":"济南府"}'::jsonb,
  36.65,
  117,
  '山东',
  '泉城胜地，家家泉水，户户垂杨。千古第一才女李清照在此度过诗酒年华，沉醉日暮，误入藕花深处。',
  '天下名城',
  NULL,
  '["taishan","kaifeng"]'::jsonb,
  '{"mapPosition":{"x":67,"y":36},"mood_on_arrive":{"freedom":20,"passion":15},"type":"city"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'jiankang',
  '建康（金陵）',
  '江苏南京',
  'tang',
  '{"tang":"金陵","song":"建康府·江宁"}'::jsonb,
  32.06,
  118.79,
  '江苏',
  '六朝古都，虎踞龙盘。李清照南渡避乱江宁，面对丈夫赵明诚弃城而逃，在乌江赋下千古名作《夏日绝句》。',
  '天下名城',
  NULL,
  '["yangzhou","hangzhou","xunyang"]'::jsonb,
  '{"mapPosition":{"x":72,"y":53},"mood_on_arrive":{"sorrow":30,"anger":20},"type":"city"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  'xiangjiang',
  '湘江（长沙/岳阳）',
  '湖南长沙/岳阳',
  'tang',
  '{"tang":"潭州湘江","song":"潭州"}'::jsonb,
  28.23,
  112.93,
  '湖南',
  '潇湘烟波，孤舟羁旅。杜甫晚年携病漂泊湘江，写下《旅夜书怀》《江南逢李龟年》，一代诗圣终老于此。',
  '人文胜迹',
  NULL,
  '["huanghelou","xunyang","chengdu"]'::jsonb,
  '{"mapPosition":{"x":54,"y":68},"mood_on_arrive":{"sorrow":40,"homesickness":30},"type":"landmark"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;

-- 3. 文人宗匠大传
INSERT INTO poets (id, name, dynasty, courtesy_name, art_name, title, birth_year, death_year, birth_place, avatar_url, portrait_url, quotes, biography, start_location_id, start_year, initial_mood, attributes, metadata, status, sort_order)
VALUES (
  'li_bai',
  '李白',
  'tang',
  '太白',
  '青莲居士',
  '诗仙',
  701,
  762,
  '蜀郡绵州昌明县青莲乡（今四川江油）',
  '/images/poets/li_bai.jpg',
  '/images/poets/li_bai.jpg',
  '["天生我材必有用，千金散尽还复来"]'::jsonb,
  '字太白，号青莲居士，盛唐浪漫主义诗歌巅峰，仗剑去国，辞亲远游，天下称之“谪仙人”。',
  'sichuan',
  701,
  '{"passion":70,"sorrow":25,"freedom":65,"anger":15,"homesickness":35}'::jsonb,
  '{"style":["romantic","adventurous","philosophical"],"theme_color":"#10B981","representative_poems":["将进酒","蜀道难","静夜思","望庐山瀑布"]}'::jsonb,
  '{"brief_intro":"盛唐浪漫主义的至高化身，仗剑出蜀，斗酒百篇，绣口一吐便是半个盛唐。","preferred_theme_id":"spring"}'::jsonb,
  'active',
  1
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  dynasty = EXCLUDED.dynasty,
  title = EXCLUDED.title,
  quotes = EXCLUDED.quotes,
  biography = EXCLUDED.biography,
  initial_mood = EXCLUDED.initial_mood,
  attributes = EXCLUDED.attributes,
  metadata = EXCLUDED.metadata;

INSERT INTO poets (id, name, dynasty, courtesy_name, art_name, title, birth_year, death_year, birth_place, avatar_url, portrait_url, quotes, biography, start_location_id, start_year, initial_mood, attributes, metadata, status, sort_order)
VALUES (
  'du_fu',
  '杜甫',
  'tang',
  '子美',
  '少陵野老',
  '诗圣',
  712,
  770,
  '河南巩县（今河南巩义）',
  '/images/poets/du_fu.svg',
  '/images/poets/du_fu.svg',
  '["安得广厦千万间，大庇天下寒士俱欢颜"]'::jsonb,
  '字子美，自号少陵野老，后世尊称“诗圣”。其诗沉郁顿挫，悲悯苍生，全面反映盛唐由盛转衰的历史全貌，被千古公推为“诗史”。',
  'taishan',
  736,
  '{"passion":45,"sorrow":60,"freedom":35,"anger":35,"homesickness":50}'::jsonb,
  '{"style":["realistic","sorrowful","patriotic","profound"],"theme_color":"#B45309","representative_poems":["望岳","春望","茅屋为秋风所破歌","登高"]}'::jsonb,
  '{"brief_intro":"集大成的万世诗圣，以沉郁顿挫之血泪史诗见证苍生黎庶，千古风骨如山。","preferred_theme_id":"tang-ink"}'::jsonb,
  'active',
  2
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  dynasty = EXCLUDED.dynasty,
  title = EXCLUDED.title,
  quotes = EXCLUDED.quotes,
  biography = EXCLUDED.biography,
  initial_mood = EXCLUDED.initial_mood,
  attributes = EXCLUDED.attributes,
  metadata = EXCLUDED.metadata;

INSERT INTO poets (id, name, dynasty, courtesy_name, art_name, title, birth_year, death_year, birth_place, avatar_url, portrait_url, quotes, biography, start_location_id, start_year, initial_mood, attributes, metadata, status, sort_order)
VALUES (
  'su_shi',
  '苏轼',
  'song',
  '子瞻',
  '东坡居士',
  '东坡居士',
  1037,
  1101,
  '眉州眉山（今四川眉山）',
  '/images/poets/su_shi.jpg',
  '/images/poets/su_shi.jpg',
  '["竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生"]'::jsonb,
  '字子瞻，号东坡居士，北宋豪放派词人代表，唐宋八大家之一，一生屡遭贬谪却随遇而安，旷达达观。',
  'hangzhou',
  1074,
  '{"passion":65,"sorrow":30,"freedom":75,"anger":20,"homesickness":45}'::jsonb,
  '{"style":["heroic","zen","optimistic","profound"],"theme_color":"#0D9488","representative_poems":["定风波","水调歌头","赤壁怀古","江城子"]}'::jsonb,
  '{"brief_intro":"北宋全才文宗，开辟豪放词派，历尽三次贬谪却笑对风雨，达观超然。","preferred_theme_id":"song-celadon"}'::jsonb,
  'active',
  3
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  dynasty = EXCLUDED.dynasty,
  title = EXCLUDED.title,
  quotes = EXCLUDED.quotes,
  biography = EXCLUDED.biography,
  initial_mood = EXCLUDED.initial_mood,
  attributes = EXCLUDED.attributes,
  metadata = EXCLUDED.metadata;

INSERT INTO poets (id, name, dynasty, courtesy_name, art_name, title, birth_year, death_year, birth_place, avatar_url, portrait_url, quotes, biography, start_location_id, start_year, initial_mood, attributes, metadata, status, sort_order)
VALUES (
  'li_qingzhao',
  '李清照',
  'song',
  '易安',
  '易安居士',
  '易安居士',
  1084,
  1155,
  '齐州章丘（今山东济南章丘）',
  '/images/poets/li_qingzhao.svg',
  '/images/poets/li_qingzhao.svg',
  '["生当作人杰，死亦为鬼雄"]'::jsonb,
  '号易安居士，宋代婉约词派宗匠，被尊为“千古第一才女”。词兼婉约与慷慨，前半生清雅俊爽，南渡后国破家亡，沉郁凄绝，风骨凌霜。',
  'jinan',
  1100,
  '{"passion":55,"sorrow":30,"freedom":65,"anger":20,"homesickness":35}'::jsonb,
  '{"style":["graceful","sorrowful","witty","patriotic"],"theme_color":"#EC4899","representative_poems":["如梦令","一剪梅","声声慢","夏日绝句"]}'::jsonb,
  '{"brief_intro":"宋代婉约词宗、千古第一才女，前承汴京泼茶清欢，后载南渡沉郁家国。","preferred_theme_id":"song-celadon"}'::jsonb,
  'active',
  4
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  dynasty = EXCLUDED.dynasty,
  title = EXCLUDED.title,
  quotes = EXCLUDED.quotes,
  biography = EXCLUDED.biography,
  initial_mood = EXCLUDED.initial_mood,
  attributes = EXCLUDED.attributes,
  metadata = EXCLUDED.metadata;

-- 4. 传世名篇题库
INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'wang_lu_shan_pu_bu',
  'li_bai',
  '望庐山瀑布',
  'tang',
  726,
  'lu_shan',
  '近体古诗',
  '“生”字极妙，化静态山峰为动态生机，日光照射水汽蒸腾如造化自生之妙，动静相生，神韵超然。 “银河”将人间飞瀑直升为九天星汉倾泻，唯有太白吞吐宇宙的绝顶浪漫与雄浑仙气，方能写出此神来之笔。',
  '["日照香炉生紫烟","遥看瀑布挂前川","飞流直下三千尺","疑是银河落九天"]'::jsonb,
  '[{"lineIndex":0,"charIndex":4,"correct":"生","options":["生","起","飘","吐"],"explanation":"“生”字极妙，化静态山峰为动态生机，日光照射水汽蒸腾如造化自生之妙，动静相生，神韵超然。","wrongExplanations":{"起":"“起”字突兀骤现，香炉峰在晴日照耀下应是岚气蒸腾、温和化育之态。","飘":"“飘”字轻盈无力，无法展现瀑布香炉水汽凝聚为紫色祥云的雄浑感。","吐":"“吐”字造作粗率，失却了自然造化的仙意与清奇。"}},{"lineIndex":3,"charIndex":2,"correct":"银河","options":["银河","白练","玉龙","云雾"],"explanation":"“银河”将人间飞瀑直升为九天星汉倾泻，唯有太白吞吐宇宙的绝顶浪漫与雄浑仙气，方能写出此神来之笔。","wrongExplanations":{"白练":"“白练”过于写实平俗，李白此句乃神来之笔，非星汉从九天垂落不足以状其奇绝。","玉龙":"“玉龙”多为战阵或冰雪俗套比喻，缺了李太白超拔宇宙的浪漫仙气。","云雾":"“云雾”呈飘散静态，无法体现奔涌下泻的磅礴动势。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"lu_shan","mood":{"freedom":{"min":50},"passion":{"min":40}},"year_range":[726,762]}}'::jsonb,
  '["tang","shi","lu_shan"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'jing_ye_si',
  'li_bai',
  '静夜思',
  'tang',
  726,
  'yangzhou',
  '近体古诗',
  '“明月”清水出芙蓉，天然去雕饰，极写秋夜月色朗照之清绝，质朴直击人心，全无文人雕琢之气。 “思”字低头良久、思绪绵长回甘，温厚含蓄而寄托深广，道尽游子无尽乡愁。',
  '["床前明月光","疑是地上霜","举头望明月","低头思故乡"]'::jsonb,
  '[{"lineIndex":0,"charIndex":2,"correct":"明月","options":["明月","冷月","皎月","落月"],"explanation":"“明月”清水出芙蓉，天然去雕饰，极写秋夜月色朗照之清绝，质朴直击人心，全无文人雕琢之气。","wrongExplanations":{"冷月":"“冷月”词意显露太尽，缺少了皎洁月色直透床前的清澈与宁静。","皎月":"“皎月”文人造作感过重，不若“明月”口语天然，清水出芙蓉。","落月":"“落月”时值破晓残月，与秋夜惊醒忽生乡愁的孤寂长夜意境不合。"}},{"lineIndex":3,"charIndex":2,"correct":"思","options":["思","忆","念","想"],"explanation":"“思”字低头良久、思绪绵长回甘，温厚含蓄而寄托深广，道尽游子无尽乡愁。","wrongExplanations":{"忆":"“忆”重在向后追溯过往人事，“思”则是心绪无边漫卷，深沉博大。","念":"“念”字稍显急促，不如“思”字低头良久的绵长回甘。","想":"“想”过于浅显平直，欠缺古典诗词的温厚含蓄。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"yangzhou","mood":{"homesickness":{"min":55}},"year_range":[726,762]}}'::jsonb,
  '["tang","shi","yangzhou"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'huang_he_lou_song_meng_hao_ran',
  'li_bai',
  '黄鹤楼送孟浩然之广陵',
  'tang',
  727,
  'huanghelou',
  '近体古诗',
  '“故人”承载相交有年的至深情谊，平实质朴却深厚动人，奠定全诗依依惜别的深情基调。 “烟花”极写江南三月柳絮如烟、繁花似锦的明媚胜景，将惜别之意融于灿烂春光中，意境空灵高远。 “唯见”写出极目凝望、帆影已逝而唯见江水奔流的天地苍茫，寄无限离情于浩浩东去之长江。',
  '["故人西辞黄鹤楼","烟花三月下扬州","孤帆远影碧空尽","唯见长江天际流"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"故人","options":["故人","良朋","夫子","知交"],"explanation":"“故人”承载相交有年的至深情谊，平实质朴却深厚动人，奠定全诗依依惜别的深情基调。","wrongExplanations":{"良朋":"虽言朋友，但“良朋”略显书卷客套，少了一份相交有年的平实深厚。","夫子":"虽李白称孟浩然“吾爱孟夫子”，但起首七字“故人西辞”更具送别苍茫之概。","知交":"音节平仄不如“故人”朗畅动人。"}},{"lineIndex":1,"charIndex":0,"correct":"烟花","options":["烟花","风光","春风","柳烟"],"explanation":"“烟花”极写江南三月柳絮如烟、繁花似锦的明媚胜景，将惜别之意融于灿烂春光中，意境空灵高远。","wrongExplanations":{"风光":"风光空洞泛指，绝无“烟花三月”柳絮如烟、繁花似锦的江南盛景之妙。","春风":"春风三月平平无奇，失却李白名句传诵千载的诗意绝美色彩。","柳烟":"柳烟专写柳色，格局过狭，不如烟花兼收花柳之盛。"}},{"lineIndex":3,"charIndex":0,"correct":"唯见","options":["唯见","空余","但看","独留"],"explanation":"“唯见”写出极目凝望、帆影已逝而唯见江水奔流的天地苍茫，寄无限离情于浩浩东去之长江。","wrongExplanations":{"空余":"“空余”过于强调凄凉落寞，李白为好友奔赴繁华扬州壮行，情虽依依，意仍开阔。","但看":"“但看”语调轻浮，不及“唯见”极目远眺天地苍茫之凝定。","独留":"“独留”语意促狭，失却江天辽阔、浩浩东去的自然壮景。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"huanghelou","mood":{"freedom":{"min":50},"sorrow":{"min":30}},"year_range":[727,762]}}'::jsonb,
  '["tang","shi","huanghelou"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'shu_dao_nan',
  'li_bai',
  '蜀道难',
  'tang',
  742,
  'chang_an',
  '近体古诗',
  '“危乎高哉”以蜀地方言惊叹起调，开篇破空而下，将秦蜀万仞绝壁之险峻拔地托出，惊心动魄。 “上青天”为千古警策奇句，以通俗极绝之语化无形险阻为天堑，三度咏叹，形成贯穿全诗的浩荡主旋律。 “天梯石栈”精准化用五丁开山、栈道悬空的开天神话，以“天梯”写其高挂云端，以“石栈”写其凿崖架木之险工。 “扪参历井”为千古化境奇句。古代星野分野中，参星对应蜀地，井星对应秦地。李白写手可“抚摩”参星、“穿历”井星，将蜀道青泥岭高插星汉之绝顶奇景写得触手可及！ “凋朱颜”炼字入木三分，极写蜀道风声鹤唳、猿猱愁攀的阴惨凄绝，令少年红颜顿失风华，深具艺术震撼力。 “喧豗”（xuān huī）形容瀑流与巨石急撞发出的震天喧闹轰鸣声，音韵急促铿锵，将蜀道水势奔腾喧骇的听觉冲击描摹得入木三分。 “一夫当关，万夫莫开”成为千古军事天险的第一成语！极言剑阁两山对峙如刀劈斧削，一人把守关门，万人难以攻克，极具政治警策意味。 “长咨嗟”作为全诗收束绝唱，诗人从神游蜀山归于现实，侧身西顾，发出对大唐政局动荡、军阀割据隐忧的深沉长叹，沉雄悲慨，余音绕梁！',
  '["噫吁嚱危乎高哉","蜀道之难难于上青天","蚕丛及鱼凫开国何茫然","尔来四万八千岁","不与秦塞通人烟","西当太白有鸟道","可以横绝峨眉巅","地崩山摧壮士死","然后天梯石栈相钩连","上有六龙回日之高标","下有冲波逆折之回川","黄鹤之飞尚不得过","猿猱欲度愁攀援","青泥何盘盘","百步九折萦岩峦","扪参历井仰胁息","以手抚膺坐长叹","问君西游何时还","畏途巉岩不可攀","但见悲鸟号古木","雄飞雌从绕林间","又闻子规啼夜月愁空山","蜀道之难难于上青天","使人听此凋朱颜","连峰去天不盈尺","枯松倒挂倚绝壁","飞湍瀑流争喧豗","砯崖转石万壑雷","其险也如此","嗟尔远道之人胡为乎来哉","剑阁峥嵘而崔嵬","一夫当关万夫莫开","所守或匪亲化为狼与豺","朝避猛虎夕避长蛇","磨牙吮血杀人如麻","锦城虽云乐不如早还家","蜀道之难难于上青天","侧身西望长咨嗟"]'::jsonb,
  '[{"lineIndex":0,"charIndex":3,"correct":"危乎高哉","options":["危乎高哉","巍峨峻哉","何其高哉","浩渺茫哉"],"explanation":"“危乎高哉”以蜀地方言惊叹起调，开篇破空而下，将秦蜀万仞绝壁之险峻拔地托出，惊心动魄。","wrongExplanations":{"巍峨峻哉":"辞藻流于汉赋刻板排偶，缺乏李太白直抒胸臆的野生原力与奇崛天性。","何其高哉":"语调单薄平俗，远不及“危乎高哉”声调激越、如临万丈深渊的震慑力。","浩渺茫哉":"多用于水势或烟云，与绝壁奇峰壁立千仞的骨力不符。"}},{"lineIndex":1,"charIndex":5,"correct":"上青天","options":["上青天","登九天","跨重霄","攀云端"],"explanation":"“上青天”为千古警策奇句，以通俗极绝之语化无形险阻为天堑，三度咏叹，形成贯穿全诗的浩荡主旋律。","wrongExplanations":{"登九天":"九天语意偏向道家神仙洞府，不如“青天”口语自然，具撼人心魄的直觉力量。","跨重霄":"跨字过于轻松，削弱了蜀道盘桓崔嵬不可逾越之绝险。","攀云端":"云端意境纤秀轻飘，失却了苍茫大地的苍凉浑厚。"}},{"lineIndex":8,"charIndex":2,"correct":"天梯石栈","options":["天梯石栈","云梁飞阁","索道飞梯","木栈连云"],"explanation":"“天梯石栈”精准化用五丁开山、栈道悬空的开天神话，以“天梯”写其高挂云端，以“石栈”写其凿崖架木之险工。","wrongExplanations":{"云梁飞阁":"偏于宫殿楼阁的富丽词藻，缺乏五丁开辟古蜀道之雄浑原始气象。","索道飞梯":"语意偏现代直白，失却先秦两汉古蜀传说的金石古意。","木栈连云":"字面虽通，但“天梯石栈”对偶紧密、声律顿挫更富文学感染力。"}},{"lineIndex":15,"charIndex":0,"correct":"扪参历井","options":["扪参历井","抚星捉月","攀天步月","摩肩蹑足"],"explanation":"“扪参历井”为千古化境奇句。古代星野分野中，参星对应蜀地，井星对应秦地。李白写手可“抚摩”参星、“穿历”井星，将蜀道青泥岭高插星汉之绝顶奇景写得触手可及！","wrongExplanations":{"抚星捉月":"泛言星月，缺乏“参星对应蜀地、井星对应秦地”精准深厚的星官地理典故。","攀天步月":"流于俗常神仙轻飘描绘，无法衬托出仰面屏气、抚胸长叹的压迫窒息感。","摩肩蹑足":"仅写行人拥挤小心，完全失却太白吞吐星汉天宇的浩荡气魄。"}},{"lineIndex":23,"charIndex":4,"correct":"凋朱颜","options":["凋朱颜","心胆寒","泪纵横","愁断肠"],"explanation":"“凋朱颜”炼字入木三分，极写蜀道风声鹤唳、猿猱愁攀的阴惨凄绝，令少年红颜顿失风华，深具艺术震撼力。","wrongExplanations":{"心胆寒":"直述生理惊恐，稍显浅白直露，失却古典格律深沉凄美的艺术韵味。","泪纵横":"更接近凡俗儿女离别悲戚，与此诗吞吐宇宙的雄浑奇诡画风相悖。","愁断肠":"过于俗滥套语，无法体现太白诗风独特的瑰奇浪漫。"}},{"lineIndex":26,"charIndex":5,"correct":"喧豗","options":["喧豗","澎湃","喧鸣","轰雷"],"explanation":"“喧豗”（xuān huī）形容瀑流与巨石急撞发出的震天喧闹轰鸣声，音韵急促铿锵，将蜀道水势奔腾喧骇的听觉冲击描摹得入木三分。","wrongExplanations":{"澎湃":"偏于描绘开阔江海波涛，无法体现深谷飞湍急流石穴撞击的怪石惊雷之感。","喧鸣":"过于平淡寻常，无法传达李白狂草般生动凶悍的自然原力。","轰雷":"下句即有“万壑雷”，若此处用“轰雷”则合掌重犯，音节单调。"}},{"lineIndex":31,"charIndex":0,"correct":"一夫当关","options":["一夫当关","一人扼险","万险当门","单夫把隘"],"explanation":"“一夫当关，万夫莫开”成为千古军事天险的第一成语！极言剑阁两山对峙如刀劈斧削，一人把守关门，万人难以攻克，极具政治警策意味。","wrongExplanations":{"一人扼险":"散文化白话陈述，缺乏与“万夫莫开”音韵对偶之千钧力道。","万险当门":"模糊了以“一夫”对“万夫”的人力反差，诗意顿失奇崛。","单夫把隘":"字眼干瘪狭隘，远不如“一夫当关”气吞万里山河。"}},{"lineIndex":37,"charIndex":4,"correct":"长咨嗟","options":["长咨嗟","空叹息","独惆怅","泪沾衣"],"explanation":"“长咨嗟”作为全诗收束绝唱，诗人从神游蜀山归于现实，侧身西顾，发出对大唐政局动荡、军阀割据隐忧的深沉长叹，沉雄悲慨，余音绕梁！","wrongExplanations":{"空叹息":"过于浅近直白，音律失却古乐府“咨嗟”咏叹之深广悠远。","独惆怅":"侧重个体闲愁，偏离了对国运安危与大好河山的一腔忠愤。","泪沾衣":"儿女态过浓，不合全诗雄奇悲壮、回肠荡气的太白宗匠风骨。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"chang_an","mood":{"passion":{"min":55},"freedom":{"min":45}},"year_range":[742,762]}}'::jsonb,
  '["tang","shi","chang_an"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'qing_ping_diao',
  'li_bai',
  '清平调·其一',
  'tang',
  743,
  'chang_an',
  '近体古诗',
  '“花想容”互文见义，将见云想裳、见花想人容之倾城国色双向交织，空灵神化，为中国咏美人诗千古第一妙喻。 “露华浓”兼写名花沐浴晨露之娇艳欲滴，与玄宗深宠沐浴君恩之恩泽深沉，双关入神，极显盛唐富丽。 “瑶台”为西王母仙宫胜境，李白巧妙地将人间绝色升华至月下仙子，奉承玄宗与贵妃却毫无脂粉俗气，骨格自高。',
  '["云想衣裳花想容","春风拂槛露华浓","若非群玉山头见","会向瑶台月下逢"]'::jsonb,
  '[{"lineIndex":0,"charIndex":4,"correct":"花想容","options":["花想容","月想貌","玉想颜","春想色"],"explanation":"“花想容”互文见义，将见云想裳、见花想人容之倾城国色双向交织，空灵神化，为中国咏美人诗千古第一妙喻。","wrongExplanations":{"月想貌":"过于直白质板，失却了以花喻容、带露生香的牡丹丰神与华贵气度。","玉想颜":"语意偏于冰冷坚硬，缺乏盛唐牡丹名花绝代佳人的雍容华贵与生机。","春想色":"造语平庸，概念模糊，全无太白御笔侍宴时的轻灵仙韵。"}},{"lineIndex":1,"charIndex":4,"correct":"露华浓","options":["露华浓","百花浓","芳菲浓","雨意浓"],"explanation":"“露华浓”兼写名花沐浴晨露之娇艳欲滴，与玄宗深宠沐浴君恩之恩泽深沉，双关入神，极显盛唐富丽。","wrongExplanations":{"百花浓":"语言粗率泛泛，无法状出牡丹朝露晶莹、玉珠凝华的微观特写。","芳菲浓":"文人习用套词，平平无奇，缺少君恩如朝露润物无声的双关意蕴。","雨意浓":"雨意带来阴晦潮湿之感，破坏了沉香亭春风和煦、晴光正好的艳丽宫廷氛围。"}},{"lineIndex":3,"charIndex":2,"correct":"瑶台","options":["瑶台","仙庭","蓬莱","紫霄"],"explanation":"“瑶台”为西王母仙宫胜境，李白巧妙地将人间绝色升华至月下仙子，奉承玄宗与贵妃却毫无脂粉俗气，骨格自高。","wrongExplanations":{"仙庭":"仙庭词意模糊，远不及“瑶台”具有西王母穆天子神话的唯美典故底蕴。","蓬莱":"蓬莱多在东海烟涛波浪间，与“群玉山”昆仑西方的仙境架构呼应不足。","紫霄":"道家道场色彩过重，偏于肃穆威严，与良宵美景赏花侍宴的浪漫调性不甚相符。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"chang_an","mood":{"passion":{"min":60}},"year_range":[742,744]}}'::jsonb,
  '["tang","shi","chang_an"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'xing_lu_nan',
  'li_bai',
  '行路难·其一',
  'tang',
  744,
  'luoyang',
  '近体古诗',
  '“金樽”与次句“玉盘”相对，极写盛宴珍馐之豪奢奢华，以此高潮反衬下文“停杯投箸”之无边落寞与悲愤。 “拔剑四顾心茫然”八字写尽一代天才政治抱负落空、身处四顾无门深渊时的剧痛与苍茫，动作极其传神。 “长风破浪会有时”化用宗悫“愿乘长风破万里浪”典故，于万千蹭蹬中爆发出昂扬向上的英雄气概，千古振聋发聩。 “直挂云帆济沧海”以浩瀚沧海为归宿，一个“济”字显出普济天下、横渡汪洋的非凡抱负与博大胸襟。',
  '["金樽清酒斗十千","玉盘珍羞直万钱","停杯投箸不能食","拔剑四顾心茫然","长风破浪会有时","直挂云帆济沧海"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"金樽","options":["金樽","玉杯","银壶","铜爵"],"explanation":"“金樽”与次句“玉盘”相对，极写盛宴珍馐之豪奢奢华，以此高潮反衬下文“停杯投箸”之无边落寞与悲愤。","wrongExplanations":{"玉杯":"玉杯语意稍弱，不如金樽更能压住“斗十千”万钱之豪奢气象。","银壶":"器物规格略逊，且音韵平仄不若金樽之响亮。","铜爵":"铜爵为先秦古礼器，古朴严肃，与盛唐盛筵之华美不相称。"}},{"lineIndex":3,"charIndex":4,"correct":"心茫然","options":["心茫然","意难平","气干云","泪湿衫"],"explanation":"“拔剑四顾心茫然”八字写尽一代天才政治抱负落空、身处四顾无门深渊时的剧痛与苍茫，动作极其传神。","wrongExplanations":{"意难平":"偏向主观情绪宣泄，缺少“心茫然”拔剑面对天地却拔剑何顾的迷惘悲壮。","气干云":"与前句“停杯投箸不能食”的抑郁压抑脉络相抵触。","泪湿衫":"落入浅俗伤感小儿女姿态，太白拔剑狂啸，绝非对樽泣下之流。"}},{"lineIndex":4,"charIndex":0,"correct":"长风破浪","options":["长风破浪","乘风破浪","乘风驭日","凭风借力"],"explanation":"“长风破浪会有时”化用宗悫“愿乘长风破万里浪”典故，于万千蹭蹬中爆发出昂扬向上的英雄气概，千古振聋发聩。","wrongExplanations":{"乘风破浪":"虽语意相近，但“长风”两字气魄更为宏阔苍茫，音节更显开阖顿挫。","乘风驭日":"神仙夸饰太甚，脱离了全诗面对现实仕途险阻矢志不移的英雄本色。","凭风借力":"口吻偏向投机取巧，全无李白傲视千古、独力劈波斩浪的豪气。"}},{"lineIndex":5,"charIndex":4,"correct":"济沧海","options":["济沧海","渡瀚海","度碧海","过重洋"],"explanation":"“直挂云帆济沧海”以浩瀚沧海为归宿，一个“济”字显出普济天下、横渡汪洋的非凡抱负与博大胸襟。","wrongExplanations":{"渡瀚海":"瀚海古代多指北方大沙漠戈壁，用“云帆”横渡瀚海显得不伦不类。","度碧海":"碧海偏于静态风景清丽，缺少万丈狂澜中一跃而过之豪迈气魄。","过重洋":"近代口语化词汇，全无盛唐古诗典雅雄放之神髓。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"luoyang","mood":{"anger":{"min":50},"sorrow":{"min":45}},"year_range":[744,762]}}'::jsonb,
  '["tang","shi","luoyang"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'qiang_jin_jiu',
  'li_bai',
  '将进酒',
  'tang',
  752,
  'yingyang',
  '近体古诗',
  '“天上来”三个字如奔马断索、惊涛裂岸，将黄河之发源自高远浩渺之苍天起笔，气魄磅礴，为古今第一起句。 “暮成雪”极度夸张，将漫长人生之岁月风霜压缩于朝夕之间，如飞瀑奔泻，写出生之短促与壮志难酬的浩大悲悯。 “天生我材必有用”乃全篇灵魂，李白在半生蹭蹬、怀才不遇的绝境中，对自我生命价值爆发出不可动摇的绝对自信！ “千金散尽还复来”体现了视金玉如泥沙的超然豪情，挥金如土、不为物累，尽显盛唐文人狂放不羁的大气象。',
  '["君不见黄河之水天上来","奔流到海不复回","君不见高堂明镜悲白发","朝如青丝暮成雪","天生我材必有用","千金散尽还复来"]'::jsonb,
  '[{"lineIndex":0,"charIndex":7,"correct":"天上来","options":["天上来","云中来","九天来","苍冥来"],"explanation":"“天上来”三个字如奔马断索、惊涛裂岸，将黄河之发源自高远浩渺之苍天起笔，气魄磅礴，为古今第一起句。","wrongExplanations":{"云中来":"云中偏于狭促飘忽，不如“天上来”直接托出宇宙鸿蒙的苍茫浩瀚。","九天来":"九天略显刻意对偶与文人做作，远不及“天上来”大巧若拙、气势万钧。","苍冥来":"辞藻生僻晦涩，破坏了黄河奔涌磅礴奔流的大气磅礴之感。"}},{"lineIndex":3,"charIndex":4,"correct":"暮成雪","options":["暮成雪","夕成霜","晚成白","夜成秋"],"explanation":"“暮成雪”极度夸张，将漫长人生之岁月风霜压缩于朝夕之间，如飞瀑奔泻，写出生之短促与壮志难酬的浩大悲悯。","wrongExplanations":{"夕成霜":"霜字质感不如雪花厚重，难以表现白发如飞雪覆盖般彻底苍老的震撼。","晚成白":"白字语言干瘪直露，缺少雪花纯净皎洁而凄美的艺术张力。","夜成秋":"偷换物候概念，偏离了对青丝与白发的天然生动对偶。"}},{"lineIndex":4,"charIndex":4,"correct":"必有用","options":["必有用","终有成","会有期","自通达"],"explanation":"“天生我材必有用”乃全篇灵魂，李白在半生蹭蹬、怀才不遇的绝境中，对自我生命价值爆发出不可动摇的绝对自信！","wrongExplanations":{"终有成":"语气偏于市井功利庸俗的世俗成就，完全脱离了李太白超然物外、纯粹自信的仙骨。","会有期":"过于委婉期待，缺少“必”字掷地作金石之声的钢铁自信。","自通达":"哲理说教感过浓，失却了盛唐豪迈如雷破空的磅礴激情。"}},{"lineIndex":5,"charIndex":4,"correct":"还复来","options":["还复来","终复还","再归来","莫复惜"],"explanation":"“千金散尽还复来”体现了视金玉如泥沙的超然豪情，挥金如土、不为物累，尽显盛唐文人狂放不羁的大气象。","wrongExplanations":{"终复还":"终字稍显刻意等待回报，不如“还”字潇洒从容、云淡风轻。","再归来":"现代白话感较重，音韵缺乏古乐府慷慨顿挫的节奏美感。","莫复惜":"侧重劝慰莫惜财物，无法展现千金散尽自然重现的无边底气。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"yingyang","mood":{"passion":{"min":70},"freedom":{"min":60}},"year_range":[752,762]}}'::jsonb,
  '["tang","shi","yingyang"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'zeng_wang_lun',
  'li_bai',
  '赠汪伦',
  'tang',
  753,
  'jingxian',
  '近体古诗',
  '“将欲行”极写行舟方动、尚未全发的刹那，平白如话，开篇点名自己名字“李白”，毫不造作，天然真淳。 “踏歌声”为唐代民间连手顿地、且行且歌的欢快民俗，写出汪伦送行时真率热烈、不落俗套的纯朴深情。 “不及汪伦送我情”以深千尺的桃花潭水直比友情之深，以有形之深水状无形之深情，脱口而出，成为千古传诵的友谊丰碑。',
  '["李白乘舟将欲行","忽闻岸上踏歌声","桃花潭水深千尺","不及汪伦送我情"]'::jsonb,
  '[{"lineIndex":0,"charIndex":4,"correct":"将欲行","options":["将欲行","正欲发","方欲走","初启程"],"explanation":"“将欲行”极写行舟方动、尚未全发的刹那，平白如话，开篇点名自己名字“李白”，毫不造作，天然真淳。","wrongExplanations":{"正欲发":"语调节奏较促狭，不如“将欲行”悠缓从容的古乐府天然之气。","方欲走":"方欲走过于白话口语化，失却诗意音韵之美。","初启程":"书卷词汇，略显刻板公文气，破坏了田园民歌式的朴素深情。"}},{"lineIndex":1,"charIndex":4,"correct":"踏歌声","options":["踏歌声","唱歌声","送别声","长啸声"],"explanation":"“踏歌声”为唐代民间连手顿地、且行且歌的欢快民俗，写出汪伦送行时真率热烈、不落俗套的纯朴深情。","wrongExplanations":{"唱歌声":"唱歌声过于泛泛，缺乏“踏歌”连手踏地、极具民间风俗与动感的生活质感。","送别声":"送别声语调哀伤凄苦，与汪伦热情豪迈、踏节而歌的欢送场景格格不入。","长啸声":"多用于隐士游仙高人，与桃花潭淳朴乡民狂欢送客的民间氛围不符。"}},{"lineIndex":3,"charIndex":4,"correct":"送我情","options":["送我情","赠我意","念我心","待客诚"],"explanation":"“不及汪伦送我情”以深千尺的桃花潭水直比友情之深，以有形之深水状无形之深情，脱口而出，成为千古传诵的友谊丰碑。","wrongExplanations":{"赠我意":"赠我意过于含蓄客套，不若“送我情”直截了当、感人肺腑。","念我心":"过于内向幽怨，失却了盛唐文人与乡间名士之间明朗澄澈的深厚友情。","待客诚":"市井应酬口吻，落入俗套，全无诗意可言。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"jingxian","mood":{"freedom":{"min":45},"passion":{"min":40}},"year_range":[753,762]}}'::jsonb,
  '["tang","shi","jingxian"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'zao_fa_bai_di_cheng',
  'li_bai',
  '早发白帝城',
  'tang',
  759,
  'baidicheng',
  '近体古诗',
  '“彩云间”极写白帝城高耸云端之缥缈奇景，更暗写晨曦破晓、大赦遇救后诗人喜极重生的明媚灿烂心境。 “一日还”将千里之遥与一日之速作极大反差对比，既写出长江三峡落差之巨大、水流之神速，更写尽遇赦东归时心花怒放之急迫与轻快！ “万重山”写尽重重险阻瞬息被抛在舟后，象征着一切厄运、流放、冤狱皆随奔流东逝，成为中国文学千古第一轻快神句！',
  '["朝辞白帝彩云间","千里江陵一日还","两岸猿声啼不住","轻舟已过万重山"]'::jsonb,
  '[{"lineIndex":0,"charIndex":4,"correct":"彩云间","options":["彩云间","白云间","青天间","九霄间"],"explanation":"“彩云间”极写白帝城高耸云端之缥缈奇景，更暗写晨曦破晓、大赦遇救后诗人喜极重生的明媚灿烂心境。","wrongExplanations":{"白云间":"白云多象征超脱清冷，缺少彩云被朝阳金光照耀下蓬勃欢愉的生命亮色。","青天间":"青天过于开阔空洞，失去了彩云环绕绝顶城池的如画仙境美感。","九霄间":"用词过于玄虚夸诞，失却白帝城晨曦日照真山真水的真实质感。"}},{"lineIndex":1,"charIndex":4,"correct":"一日还","options":["一日还","半日达","瞬息还","转瞬归"],"explanation":"“一日还”将千里之遥与一日之速作极大反差对比，既写出长江三峡落差之巨大、水流之神速，更写尽遇赦东归时心花怒放之急迫与轻快！","wrongExplanations":{"半日达":"半日达与千里空间尺度脱节，且语言显得急促浅露，失却七绝的音韵舒展。","瞬息还":"夸张过分近乎荒诞，破坏了现实水程与心理时空的精妙平衡。","转瞬归":"音节平仄失谐，远不及“一日还”斩钉截铁、爽朗昂扬。"}},{"lineIndex":3,"charIndex":4,"correct":"万重山","options":["万重山","千重山","百重山","九叠峦"],"explanation":"“万重山”写尽重重险阻瞬息被抛在舟后，象征着一切厄运、流放、冤狱皆随奔流东逝，成为中国文学千古第一轻快神句！","wrongExplanations":{"千重山":"千字在数量与气势上远不及“万重”浩瀚苍茫，失却重山飞渡的磅礴动能。","百重山":"格局过小，无法状出三峡两岸危崖万仞、连绵不绝的崇山峻岭。","九叠峦":"辞藻刻意求奇，破坏了整句顺流直下、一气呵成的天成气脉。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"baidicheng","mood":{"freedom":{"min":70},"passion":{"min":60}},"year_range":[759,762]}}'::jsonb,
  '["tang","shi","baidicheng"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'wang_yue',
  'du_fu',
  '望岳',
  'tang',
  736,
  'taishan',
  '近体古诗',
  '“岱宗”为泰山之尊称，“岱”字古雅高拔，“宗”字显万山宗仰之帝象，起笔突兀惊绝。 “未了”二字神来之笔，写泰山苍翠横跨齐鲁大地，浩浩荡荡无有穷尽，充满磅礴的生命力。 “割”字炼字极精，泰山巍峨遮天蔽日，山南山北如被神刃劈割开明暗，化静为动，气魄惊天。 “凌”字不仅是登临，更有凌驾八荒、俯瞰群伦的青年狂豪与凌云壮志。 “众山”化用孔子“登泰山而小天下”之典，展现青年杜甫兼济天下、勇攀顶峰的博大襟怀。',
  '["岱宗夫如何","齐鲁青未了","造化钟神秀","阴阳割昏晓","荡胸生曾云","决眦入归鸟","会当凌绝顶","一览众山小"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"岱宗","options":["岱宗","泰山","岳尊","东岳"],"explanation":"“岱宗”为泰山之尊称，“岱”字古雅高拔，“宗”字显万山宗仰之帝象，起笔突兀惊绝。","wrongExplanations":{"泰山":"“泰山”过于平直通俗，不如“岱宗”兼备王者尊崇与上古浩荡之气。","岳尊":"古乐府无“岳尊”之特称，失却五岳独尊的历史厚重。","东岳":"“东岳”偏向地理方位叙述，缺乏扑面而来的仰止之叹。"}},{"lineIndex":1,"charIndex":2,"correct":"未了","options":["未了","无际","连天","不绝"],"explanation":"“未了”二字神来之笔，写泰山苍翠横跨齐鲁大地，浩浩荡荡无有穷尽，充满磅礴的生命力。","wrongExplanations":{"无际":"“无际”流于空泛，不及“未了”写出青绿山色绵延无休的生动视觉感受。","连天":"“连天”俗套，缺乏诗人极目远眺时的惊叹韵致。","不绝":"“不绝”偏重声音或时间，形容山峦青翠不如“未了”蕴藉传神。"}},{"lineIndex":3,"charIndex":2,"correct":"割","options":["割","分","破","断"],"explanation":"“割”字炼字极精，泰山巍峨遮天蔽日，山南山北如被神刃劈割开明暗，化静为动，气魄惊天。","wrongExplanations":{"分":"“分”字寻常轻描，毫无泰山拔地而起、横绝阴阳的神力震撼。","破":"“破”字过于突兀割裂，破坏了天地开阖的恢弘气势。","断":"“断”字显得生硬死板，远不如“割”字展现自然神工之造化。"}},{"lineIndex":6,"charIndex":2,"correct":"凌","options":["凌","登","上","至"],"explanation":"“凌”字不仅是登临，更有凌驾八荒、俯瞰群伦的青年狂豪与凌云壮志。","wrongExplanations":{"登":"“登”字平铺直叙，仅为动作，毫无俯视一切的气概。","上":"“上”字口语浅白，缺乏杜陵野老早期兼济天下的豪情。","至":"“至”字意态滞涩，缺少飞跃凌空的豪迈神采。"}},{"lineIndex":7,"charIndex":2,"correct":"众山","options":["众山","群山","千山","万峰"],"explanation":"“众山”化用孔子“登泰山而小天下”之典，展现青年杜甫兼济天下、勇攀顶峰的博大襟怀。","wrongExplanations":{"群山":"“群山”未合孔子登泰山而小天下之正典语感。","千山":"“千山”偏数字夸饰，不如“众山”体现以一己之雄立于众生之巅。","万峰":"“万峰”平仄欠谐，不如“众山”浑然纯正。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"taishan","mood":{"passion":{"min":40}},"year_range":[735,745]}}'::jsonb,
  '["tang","shi","taishan"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'chun_wang',
  'du_fu',
  '春望',
  'tang',
  757,
  'chang_an',
  '近体古诗',
  '“国破”起句如千钧重锤敲响，国都残破沦陷而大好山河依旧，字字饱含痛彻心扉的家国悲鸣。 “草木深”写尽长安城破后的荒凉破败，春色虽至，不见帝都繁华，但见杂草灌木疯长遮道，令人触目惊心。 “花溅泪”采用移情入物之绝妙修辞，花本无知，诗人感伤时局，见花开反激起泪下沾襟，甚至仿佛花朵自身亦在垂泪。 “鸟惊心”与“花溅泪”天衣无缝相对，离乱之际闻得鸟鸣，反觉心惊胆战，情景交融至极。 “三月”既指战火连绵至暮春三月，又指战争旷日持久已历多月，更自然引发下联“家书抵万金”之急切。 “抵万金”写尽战乱时代音讯隔绝的极度珍贵与深沉相思，千古名言，无可更动。 “浑欲”意为“简直要、快要”，生动传神地勾勒出诗人忧国忧家、愁白头发甚至稀疏得簪子都插不住的老迈心酸之态。',
  '["国破山河在","城春草木深","感时花溅泪","恨别鸟惊心","烽火连三月","家书抵万金","白头搔更短","浑欲不胜簪"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"国破","options":["国破","城倾","乱世","劫后"],"explanation":"“国破”起句如千钧重锤敲响，国都残破沦陷而大好山河依旧，字字饱含痛彻心扉的家国悲鸣。","wrongExplanations":{"城倾":"“城倾”偏狭于城墙建筑之倾颓，不及“国破”指整个大唐社稷沦丧之痛。","乱世":"“乱世”平铺客观，缺乏诗人在敌占区亲见国都沦陷的撕心裂肺之情。","劫后":"“劫后”偏时间过渡，失却“国破”与“山河在”的宏阔对立。"}},{"lineIndex":1,"charIndex":2,"correct":"草木深","options":["草木深","草木春","花鸟新","烟景深"],"explanation":"“草木深”写尽长安城破后的荒凉破败，春色虽至，不见帝都繁华，但见杂草灌木疯长遮道，令人触目惊心。","wrongExplanations":{"草木春":"重叠“春”字，语意浅薄，无法凸显城池荒芜无人打理的凄凉。","花鸟新":"“花鸟新”显生机欢愉，与国破之惨状背道而驰。","烟景深":"“烟景深”流于游山玩水之调，缺乏兵燹残败的真实触觉。"}},{"lineIndex":2,"charIndex":2,"correct":"花溅泪","options":["花溅泪","泪如雨","花亦悲","常流泪"],"explanation":"“花溅泪”采用移情入物之绝妙修辞，花本无知，诗人感伤时局，见花开反激起泪下沾襟，甚至仿佛花朵自身亦在垂泪。","wrongExplanations":{"泪如雨":"“泪如雨”直露粗浅，缺乏诗意转换。","花亦悲":"“花亦悲”缺少“溅”字水滴飞溅的鲜活动态与视觉冲击。","常流泪":"过于直白质木，全无律诗深厚蕴藉之神韵。"}},{"lineIndex":3,"charIndex":2,"correct":"鸟惊心","options":["鸟惊心","意难平","鸟独啼","闻鸟惊"],"explanation":"“鸟惊心”与“花溅泪”天衣无缝相对，离乱之际闻得鸟鸣，反觉心惊胆战，情景交融至极。","wrongExplanations":{"意难平":"破坏了以乐景衬哀情、移情于春鸟的绝妙对仗。","鸟独啼":"平淡无力，缺少惊悸动魄的心灵震颤。","闻鸟惊":"平仄失调，语意生硬。"}},{"lineIndex":4,"charIndex":2,"correct":"三月","options":["三月","千里","连年","半载"],"explanation":"“三月”既指战火连绵至暮春三月，又指战争旷日持久已历多月，更自然引发下联“家书抵万金”之急切。","wrongExplanations":{"千里":"“连千里”与后文“家书”之时间苦候不谐，三月既是春季亦是苦盼时光。","连年":"当时安禄山叛乱尚在第二年春，称“连年”不符当时历史纪实。","半载":"过于生硬死板，不如“三月”双关暮春春色与久战。"}},{"lineIndex":5,"charIndex":2,"correct":"万金","options":["万金","千金","万重","千金贵"],"explanation":"“抵万金”写尽战乱时代音讯隔绝的极度珍贵与深沉相思，千古名言，无可更动。","wrongExplanations":{"千金":"“千金”份量不足以表达生死未卜之际一封平安信的无价份量。","万重":"语意含混，不成成语。","千金贵":"字数溢出，律诗节奏破坏。"}},{"lineIndex":7,"charIndex":0,"correct":"浑欲","options":["浑欲","几欲","竟至","殆欲"],"explanation":"“浑欲”意为“简直要、快要”，生动传神地勾勒出诗人忧国忧家、愁白头发甚至稀疏得簪子都插不住的老迈心酸之态。","wrongExplanations":{"几欲":"不如“浑欲”有唐人白话诗语的率真与苦涩沉痛。","竟至":"书卷气过重，缺少日常搔头叹息的生活真实感。","殆欲":"古奥生涩，破坏了结句苍凉沉痛的直抒胸臆。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"chang_an","mood":{"sorrow":{"min":50}},"year_range":[755,758]}}'::jsonb,
  '["tang","shi","chang_an"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'chun_ye_xi_yu',
  'du_fu',
  '春夜喜雨',
  'tang',
  761,
  'chengdu',
  '近体古诗',
  '“好雨”开篇便拟人化，不仅赞美雨之适时，更将雨视为知心之客，亲切欢欣。 “潜”字妙绝千古，写出春雨无声无息、乘着夜风悄然降临的体贴入微，绝无惊扰世人之狂躁。 “润物”二字精确点出春雨滋养万物、使其萌蘖而不居功自傲的崇高仁爱意蕴。 “独明”以江中一叶小舟的点点渔火，反衬出四野黑云翻墨、雨意浓厚的广袤深沉，空灵绝妙。 “重”读 zhòng，写雨露浸润饱含水汽的花朵沉甸甸、红艳艳压满枝头的繁盛生机，神采飞扬。',
  '["好雨知时节","当春乃发生","随风潜入夜","润物细无声","野径云俱黑","江船火独明","晓看红湿处","花重锦官城"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"好雨","options":["好雨","春雨","喜雨","甘霖"],"explanation":"“好雨”开篇便拟人化，不仅赞美雨之适时，更将雨视为知心之客，亲切欢欣。","wrongExplanations":{"春雨":"“春雨”只是客观称谓，不及“好”字流露出诗人深切的喜悦与欣慰。","喜雨":"诗题已有“喜”字，开篇复用则落入重叠，不如“好雨”质朴动人。","甘霖":"“甘霖”官样文章气太重，缺少诗人与自然欣然相契的生活亲近感。"}},{"lineIndex":2,"charIndex":2,"correct":"潜","options":["潜","飘","洒","落"],"explanation":"“潜”字妙绝千古，写出春雨无声无息、乘着夜风悄然降临的体贴入微，绝无惊扰世人之狂躁。","wrongExplanations":{"飘":"“飘”偏向轻扬浮动，不及“潜”字暗含润物无声之神性默契。","洒":"“洒”动静过于明显外显，缺少夜色中细雨悄然而至的神韵。","落":"“落”字平庸呆板，全无灵动之机。"}},{"lineIndex":3,"charIndex":0,"correct":"润物","options":["润物","滋物","洗尘","遍野"],"explanation":"“润物”二字精确点出春雨滋养万物、使其萌蘖而不居功自傲的崇高仁爱意蕴。","wrongExplanations":{"滋物":"“滋物”声调不够柔和圆润，不如“润”字兼具水润光泽与温存感。","洗尘":"“洗尘”侧重清洁，完全偏离了春雨催生百草万物的农本主旨。","遍野":"过于宽泛，无法表现细微之处万物吸吮雨露的静美。"}},{"lineIndex":5,"charIndex":2,"correct":"独明","options":["独明","微明","分明","初明"],"explanation":"“独明”以江中一叶小舟的点点渔火，反衬出四野黑云翻墨、雨意浓厚的广袤深沉，空灵绝妙。","wrongExplanations":{"微明":"“微明”气势弱化，不如“独明”在一片漆黑中如明星般具有聚焦感。","分明":"过于生硬，缺少诗意的留白。","初明":"时间上不合夜深时分渔火恒明的实景。"}},{"lineIndex":7,"charIndex":1,"correct":"重","options":["重","满","发","落"],"explanation":"“重”读 zhòng，写雨露浸润饱含水汽的花朵沉甸甸、红艳艳压满枝头的繁盛生机，神采飞扬。","wrongExplanations":{"满":"“满”字寻常流俗，不及“重”字写出了花瓣饱含春雨后沉甸娇艳之质感。","发":"“发”字仅为开放，缺少雨后花朵湿润沉坠之实感。","落":"“落”字悲切，与全诗喜雨、盼望丰收生机之喜悦截然相反。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"chengdu","mood":{"freedom":{"min":40}},"year_range":[760,765]}}'::jsonb,
  '["tang","shi","chengdu"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'mao_wu_wei_qiu_feng_suo_po_ge',
  'du_fu',
  '茅屋为秋风所破歌',
  'tang',
  761,
  'chengdu',
  '近体古诗',
  '“怒号”写秋风风力之凶猛狂烈，如猛兽咆哮，声势逼人，拉开全诗激荡序幕。 “三重茅”极言狂风破坏之烈，连层叠厚盖的三层茅草亦被整卷掀飞，草堂顷刻露天。 “布衾”多年未换、板结如铁，真实道尽贫寒交迫的生活艰辛与风雨凄清。 “广厦”意指宽阔博大之高宇楼阁，承载着杜甫兼济苍生、庇佑天下寒士的无上仁圣胸襟。 “天下寒士”是杜甫最动人的呼告，由自身茅屋被破之苦，顿推及普天下所有贫困失所之读书人与苍生，心胸绝大！ “吾庐独破”掷地有声，只要天下人都能得庇欢颜，纵然唯独我自己的茅屋破毁受冻而死，我也心甘情愿！至仁至圣，泣鬼神！',
  '["八月秋高风怒号","卷我屋上三重茅","布衾多年冷似铁","娇儿恶卧踏里裂","床头屋漏无干处","雨脚如麻未断绝","安得广厦千万间","大庇天下寒士俱欢颜","风雨不动安如山","呜呼何时眼前突兀见此屋","吾庐独破受冻死亦足"]'::jsonb,
  '[{"lineIndex":0,"charIndex":4,"correct":"怒号","options":["怒号","狂吹","大作","呼啸"],"explanation":"“怒号”写秋风风力之凶猛狂烈，如猛兽咆哮，声势逼人，拉开全诗激荡序幕。","wrongExplanations":{"狂吹":"过于直白口语，缺少古风乐府雄阔的气势。","大作":"平淡陈词，不如“怒号”赋狂风以搏杀天地之生命力。","呼啸":"声势较窄，不如“怒号”深沉撼人。"}},{"lineIndex":1,"charIndex":4,"correct":"三重茅","options":["三重茅","百重茅","草堂顶","数层茅"],"explanation":"“三重茅”极言狂风破坏之烈，连层叠厚盖的三层茅草亦被整卷掀飞，草堂顷刻露天。","wrongExplanations":{"百重茅":"夸张过甚失真，反失纪实感染力。","草堂顶":"语境呆板，失却茅草被狂风撕扯抛飞的惨状。","数层茅":"不如“三重”具象传神。"}},{"lineIndex":2,"charIndex":0,"correct":"布衾","options":["布衾","寒被","棉被","单衣"],"explanation":"“布衾”多年未换、板结如铁，真实道尽贫寒交迫的生活艰辛与风雨凄清。","wrongExplanations":{"寒被":"寻常称呼，不及“布衾”写出粗布旧被之质感。","棉被":"唐代尚未普及棉花被，与历史实物考据不合。","单衣":"下文讲“娇儿恶卧”，指的是夜卧之被褥而非身上单衣。"}},{"lineIndex":6,"charIndex":2,"correct":"广厦","options":["广厦","高楼","巨室","琼楼"],"explanation":"“广厦”意指宽阔博大之高宇楼阁，承载着杜甫兼济苍生、庇佑天下寒士的无上仁圣胸襟。","wrongExplanations":{"高楼":"“高楼”世俗，缺少博大庇覆万民的悲悯殿堂感。","巨室":"音韵生涩，无法承载“千万间”的磅礴气象。","琼楼":"“琼楼”偏向仙界享乐，与下文寒士欢颜之旨大相径庭。"}},{"lineIndex":7,"charIndex":2,"correct":"天下寒士","options":["天下寒士","四海黎民","万方穷民","天下苍生"],"explanation":"“天下寒士”是杜甫最动人的呼告，由自身茅屋被破之苦，顿推及普天下所有贫困失所之读书人与苍生，心胸绝大！","wrongExplanations":{"四海黎民":"不如“天下寒士”包含了知识分子兼济天下而困顿无依的共同悲运。","万方穷民":"用词生涩，格调欠雅。","天下苍生":"平仄与句法稍逊于“天下寒士俱欢颜”之顿挫。"}},{"lineIndex":10,"charIndex":0,"correct":"吾庐独破","options":["吾庐独破","哪怕我死","只要天下","任我受冻"],"explanation":"“吾庐独破”掷地有声，只要天下人都能得庇欢颜，纵然唯独我自己的茅屋破毁受冻而死，我也心甘情愿！至仁至圣，泣鬼神！","wrongExplanations":{"哪怕我死":"浅白失韵，毫无古代文人自我牺牲的浩然之气。","只要天下":"缺少与“广厦万间”和“独此一庐”的强烈对照。","任我受冻":"语气颓唐被动，不及“吾庐独破受冻死亦足”之慷慨壮烈。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"chengdu","mood":{"sorrow":{"min":40},"passion":{"min":40}},"year_range":[760,765]}}'::jsonb,
  '["tang","shi","chengdu"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'deng_gao',
  'du_fu',
  '登高',
  'tang',
  767,
  'baidicheng',
  '近体古诗',
  '“风急天高”起笔六字包蕴山川气象，夔门峡江上空狂风呼号、苍穹高远，猿啼哀切，惊心动魄。 “萧萧下”写落叶飘落的苍凉音响与无边无际的空蒙意境，千古绝句，声情悲壮。 “滚滚来”写长江江水浩浩汤汤、从巴蜀巫峡向东奔涌而来，与“萧萧下”天衣无缝，时空吞吐无限。 “万里悲秋”四字包罗八层悲意：万里离家、深秋时节、常年羁旅、孤身异乡，沉郁顿挫至极。 “独登台”一个“独”字力透纸背，晚年身患肺痹、风疾，在重阳佳节独自一人登上高台，孤独深重入骨。 “艰难苦恨”包含国难民艰、壮志难酬的无尽悲愤与切齿之痛，直抒胸臆，撼人心魄。 “潦倒”写尽疾病缠身、穷愁潦倒至极，连唯一能浇愁的浊酒也因病不得不停饮，悲凉入髓。',
  '["风急天高猿啸哀","渚清沙白鸟飞回","无边落木萧萧下","不尽长江滚滚来","万里悲秋常作客","百年多病独登台","艰难苦恨繁霜鬓","潦倒新停浊酒杯"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"风急天高","options":["风急天高","秋风萧瑟","峡深天阔","秋风凛冽"],"explanation":"“风急天高”起笔六字包蕴山川气象，夔门峡江上空狂风呼号、苍穹高远，猿啼哀切，惊心动魄。","wrongExplanations":{"秋风萧瑟":"四字俗套平衍，不及“风急天高”兼具力度、空间与高耸之势。","峡深天阔":"缺少急风呼啸的动态听觉冲击力。","秋风凛冽":"音韵不及“风急天高”纯厚劲拔。"}},{"lineIndex":2,"charIndex":2,"correct":"萧萧下","options":["萧萧下","纷纷落","千峰落","漫天落"],"explanation":"“萧萧下”写落叶飘落的苍凉音响与无边无际的空蒙意境，千古绝句，声情悲壮。","wrongExplanations":{"纷纷落":"“纷纷落”流于轻软，全无三峡深秋落木如雨、苍茫萧索的雄浑悲壮。","千峰落":"句意滞重，失去飘然而落的动态神韵。","漫天落":"浅直无味，缺乏“萧萧”象声叠字之幽深韵律。"}},{"lineIndex":3,"charIndex":2,"correct":"滚滚来","options":["滚滚来","滔滔去","奔腾流","万里来"],"explanation":"“滚滚来”写长江江水浩浩汤汤、从巴蜀巫峡向东奔涌而来，与“萧萧下”天衣无缝，时空吞吐无限。","wrongExplanations":{"滔滔去":"“滔滔去”气势偏向流走衰微，不及“滚滚来”迎面扑来、奔腾万里的雄强压迫感。","奔腾流":"失却平水韵一东韵部之对仗。","万里来":"语意重复前句之空间，不如“滚滚来”声威震天。"}},{"lineIndex":4,"charIndex":0,"correct":"万里悲秋","options":["万里悲秋","千山孤客","一生漂泊","白首孤客"],"explanation":"“万里悲秋”四字包罗八层悲意：万里离家、深秋时节、常年羁旅、孤身异乡，沉郁顿挫至极。","wrongExplanations":{"千山孤客":"缩小了空间跨度，不及“万里”从巴蜀到江南之无际苍茫。","一生漂泊":"语意平白直说，缺少“悲秋”这一古典悲剧时令的文化沉淀。","白首孤客":"与下句“百年多病”中之老病形成概念重叠。"}},{"lineIndex":5,"charIndex":2,"correct":"独登台","options":["独登台","叹登台","倚楼台","自登台"],"explanation":"“独登台”一个“独”字力透纸背，晚年身患肺痹、风疾，在重阳佳节独自一人登上高台，孤独深重入骨。","wrongExplanations":{"叹登台":"“叹”字流于轻叹，缺少“独”字所承载的万籁俱寂、孑然一身的绝大孤寂。","倚楼台":"语意闲散，与登高临风的苍茫搏击不合。","自登台":"平淡无力。"}},{"lineIndex":6,"charIndex":0,"correct":"艰难苦恨","options":["艰难苦恨","平生坎坷","世事沧桑","岁暮天寒"],"explanation":"“艰难苦恨”包含国难民艰、壮志难酬的无尽悲愤与切齿之痛，直抒胸臆，撼人心魄。","wrongExplanations":{"平生坎坷":"平庸书生之语，缺少杜甫为国步艰难而恨白青丝的时代痛感。","世事沧桑":"过于宽泛，缺乏诗人切身体验的艰辛刻骨。","岁暮天寒":"只写天气，脱离了诗人对世事家国的忧愤。"}},{"lineIndex":7,"charIndex":0,"correct":"潦倒","options":["潦倒","老迈","衰颓","漂泊"],"explanation":"“潦倒”写尽疾病缠身、穷愁潦倒至极，连唯一能浇愁的浊酒也因病不得不停饮，悲凉入髓。","wrongExplanations":{"老迈":"仅写年龄，没有身世困顿、穷愁莫解的复杂叹惋。","衰颓":"语调过分颓废，缺少诗人虽穷困仍傲岸登台的风骨。","漂泊":"上句已有“作客”，此处当着重病体与断酒之凄怆。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"baidicheng","mood":{"sorrow":{"min":60}},"year_range":[765,770]}}'::jsonb,
  '["tang","shi","baidicheng"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'wen_guan_jun_shou_he_nan_he_bei',
  'du_fu',
  '闻官军收河南河北',
  'tang',
  763,
  'chengdu',
  '近体古诗',
  '“剑外”指剑阁以南的蜀地，开门见山点明自己客居蜀中忽闻喜讯的激荡背景。 “漫卷诗书”写尽诗人平日视诗书为命，此时喜极发狂，胡乱卷起书册不再顾惜的欢态毕现。 “须纵酒”一气呵成，大白天里便要放声高歌、纵情痛饮，毫无拘束羁绊。 “青春”在此指明媚烂漫的春天景色，以烂漫春光为伴还乡，明朗欢畅之极。 “即从...穿...便下...向...”，四座名城地名在一联中疾驰掠过，如骏马下坂，舟行千里，畅快淋漓！',
  '["剑外忽传收蓟北","初闻涕泪满衣裳","却看妻子愁何在","漫卷诗书喜欲狂","白日放歌须纵酒","青春作伴好还乡","即从巴峡穿巫峡","便下襄阳向洛阳"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"剑外","options":["剑外","蜀中","巴蜀","锦城"],"explanation":"“剑外”指剑阁以南的蜀地，开门见山点明自己客居蜀中忽闻喜讯的激荡背景。","wrongExplanations":{"蜀中":"平铺直叙，缺少“剑门关外”关山阻隔却忽通音信的惊雷之感。","巴蜀":"过于宽泛，不如“剑外”带边塞险隘的军事地理质感。","锦城":"局限于成都城内，与全诗纵横千里的气势不符。"}},{"lineIndex":3,"charIndex":0,"correct":"漫卷诗书","options":["漫卷诗书","倒掷笔墨","欢呼跳跃","痛饮千钟"],"explanation":"“漫卷诗书”写尽诗人平日视诗书为命，此时喜极发狂，胡乱卷起书册不再顾惜的欢态毕现。","wrongExplanations":{"倒掷笔墨":"夸张过火，缺少读书人特有的生活细节。","欢呼跳跃":"直露浅白，缺少诗家炼字韵致。","痛饮千钟":"混同于李白之狂，非少陵野老诗书传家之狂喜。"}},{"lineIndex":4,"charIndex":2,"correct":"须纵酒","options":["须纵酒","当纵酒","同纵酒","宜痛饮"],"explanation":"“须纵酒”一气呵成，大白天里便要放声高歌、纵情痛饮，毫无拘束羁绊。","wrongExplanations":{"当纵酒":"“当”字语气偏向议论理智，不如“须”字急不可待之狂放。","同纵酒":"失却个人痛快淋漓的主动感。","宜痛饮":"平仄欠谐，不如“须纵酒”爽朗快意。"}},{"lineIndex":5,"charIndex":0,"correct":"青春","options":["青春","春光","春风","和风"],"explanation":"“青春”在此指明媚烂漫的春天景色，以烂漫春光为伴还乡，明朗欢畅之极。","wrongExplanations":{"春光":"不如“青春”带朝气蓬勃、生机勃发之拟人美感。","春风":"仅指风，不如“青春”涵括万物复苏、天地焕然一新之喜气。","和风":"平淡无奇。"}},{"lineIndex":7,"charIndex":0,"correct":"便下","options":["便下","直下","疾驶","顺流"],"explanation":"“即从...穿...便下...向...”，四座名城地名在一联中疾驰掠过，如骏马下坂，舟行千里，畅快淋漓！","wrongExplanations":{"直下":"破坏了“即从...便下...”相呼应的疾速连环句法。","疾驶":"流于客观动作描写，全无诗情流转之妙。","顺流":"平铺直叙，失却杜甫这首“平生第一快诗”的喷薄节奏。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"chengdu","mood":{"passion":{"min":60}},"year_range":[762,765]}}'::jsonb,
  '["tang","shi","chengdu"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'shu_xiang',
  'du_fu',
  '蜀相',
  'tang',
  760,
  'chengdu',
  '近体古诗',
  '“丞相祠堂”起笔开门见山，直呼“丞相”，充满杜甫对诸葛孔明匡扶汉室、千载名相风骨的无上敬仰。 “柏森森”写武侯祠中古柏参天、森然茂密的庄严肃穆景象，自古柏树象征坚贞节操。 “自春色”一个“自”字妙入微芒，阶前碧草年年春深自绿，却无人凭吊欣赏，以乐景衬无尽凄凉。 “空好音”与“自春色”天生一对，“空”字道尽黄鹂啼声虽巧，英雄已逝，徒留空山鸟鸣的浩叹。 “三顾频烦”高度凝练刘备三顾茅庐与诸葛孔明剖析天下三分之宏图，言简意深。 “两朝开济”涵盖开创基业（刘备）与济度危难（刘禅托孤），七字道尽孔明鞠躬尽瘁之崇高一生。 “出师未捷”千古绝唱！写诸葛孔明六出祁山病逝五丈原的无上遗恨，千百年来引无量志士仁人扼腕痛惜。 “长使英雄泪满襟”震撼古今，不仅是为诸葛孔明而泣，更为历史上所有抱负未展、饮恨长逝的英雄豪杰而流！',
  '["丞相祠堂何处寻","锦官城外柏森森","映阶碧草自春色","隔叶黄鹂空好音","三顾频烦天下计","两朝开济老臣心","出师未捷身先死","长使英雄泪满襟"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"丞相祠堂","options":["丞相祠堂","诸葛祠堂","武侯遗庙","汉相古庙"],"explanation":"“丞相祠堂”起笔开门见山，直呼“丞相”，充满杜甫对诸葛孔明匡扶汉室、千载名相风骨的无上敬仰。","wrongExplanations":{"诸葛祠堂":"失却“丞相”这一官衔所代表的辅佐社稷、受托孤之重任的历史尊崇感。","武侯遗庙":"略嫌书面客观，不如设问“何处寻”自然引出“丞相祠堂”。","汉相古庙":"称谓罕用，缺少民间与后世口口相传的亲切肃穆。"}},{"lineIndex":1,"charIndex":4,"correct":"柏森森","options":["柏森森","草萋萋","绿荫荫","树苍苍"],"explanation":"“柏森森”写武侯祠中古柏参天、森然茂密的庄严肃穆景象，自古柏树象征坚贞节操。","wrongExplanations":{"草萋萋":"草萋萋显荒凉败落，古柏森森方显祠庙常新、万古景仰之威仪。","绿荫荫":"浅显平俗，缺少古木参天之肃穆历史感。","树苍苍":"“树”泛称，不及“柏”特指诸葛孔明忠贞如柏之品质。"}},{"lineIndex":2,"charIndex":2,"correct":"自春色","options":["自春色","生春色","迎春色","含春色"],"explanation":"“自春色”一个“自”字妙入微芒，阶前碧草年年春深自绿，却无人凭吊欣赏，以乐景衬无尽凄凉。","wrongExplanations":{"生春色":"只是客观萌生，失去空灵寂寥的叹息感。","迎春色":"带逢迎欢悦之气，与祠庙幽静凭吊的氛围完全不合。","含春色":"造语平庸，缺少“自”字所包含的空寂惆怅。"}},{"lineIndex":3,"charIndex":2,"correct":"空好音","options":["空好音","有好音","啼好音","发清音"],"explanation":"“空好音”与“自春色”天生一对，“空”字道尽黄鹂啼声虽巧，英雄已逝，徒留空山鸟鸣的浩叹。","wrongExplanations":{"有好音":"平铺叙事，全无物是人非、千载寂寥之感慨。","啼好音":"语意重复，缺乏深度。","发清音":"平仄不叶，缺少“空”字那抹直击心底的虚空惆怅。"}},{"lineIndex":4,"charIndex":0,"correct":"三顾频烦","options":["三顾频烦","草庐三顾","先帝三顾","躬耕南阳"],"explanation":"“三顾频烦”高度凝练刘备三顾茅庐与诸葛孔明剖析天下三分之宏图，言简意深。","wrongExplanations":{"草庐三顾":"偏重故事叙述，不及“频烦”写出刘备屡次求贤的诚恳勤劳。","先帝三顾":"“先帝”与后句“两朝”概念稍见重复。","躬耕南阳":"只写孔明隐居，未写出明君良臣相得之激荡风云。"}},{"lineIndex":5,"charIndex":0,"correct":"两朝开济","options":["两朝开济","一生鞠躬","万古忠贞","出师表里"],"explanation":"“两朝开济”涵盖开创基业（刘备）与济度危难（刘禅托孤），七字道尽孔明鞠躬尽瘁之崇高一生。","wrongExplanations":{"一生鞠躬":"浅近直白，不如“两朝开济”气象恢宏、功业卓著。","万古忠贞":"纯为口号评价，缺少历史功业的雄浑概括力。","出师表里":"局促于文章，失却经世济民的大格局。"}},{"lineIndex":6,"charIndex":0,"correct":"出师未捷","options":["出师未捷","大功未成","中原未复","汉室未兴"],"explanation":"“出师未捷”千古绝唱！写诸葛孔明六出祁山病逝五丈原的无上遗恨，千百年来引无量志士仁人扼腕痛惜。","wrongExplanations":{"大功未成":"泛指功业，失去大军出师北伐的历史悲壮感。","中原未复":"虽合实情，但不如原诗“出师未捷”化用岳武穆等后世英雄心声之深广。","汉室未兴":"语意平促，不及“出师未捷”语带风雷。"}},{"lineIndex":7,"charIndex":2,"correct":"泪满襟","options":["泪满襟","泪沾襟","常叹息","空长叹"],"explanation":"“长使英雄泪满襟”震撼古今，不仅是为诸葛孔明而泣，更为历史上所有抱负未展、饮恨长逝的英雄豪杰而流！","wrongExplanations":{"泪沾襟":"“沾”字份量太轻，不及“满襟”泪如雨下、悲怆难抑之痛。","常叹息":"平淡寡味，完全丧失了七律沉雄悲壮之神韵。","空长叹":"语力萎靡不振。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"chengdu","mood":{"sorrow":{"min":30}},"year_range":[759,765]}}'::jsonb,
  '["tang","shi","chengdu"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'lv_ye_shu_huai',
  'du_fu',
  '旅夜书怀',
  'tang',
  765,
  'xiangjiang',
  '近体古诗',
  '“细草微风”写江岸近景，微风吹拂岸边柔弱细草，起笔轻柔，却为全诗浩瀚孤独埋下伏笔。 “独夜舟”一个“独”字与“夜”字，将孤舟羁旅黑夜茫茫的绝大孤独凝注笔端。 “星垂”二字雄奇无匹，荒野极其辽阔，远方星空仿佛垂挂在广袤无垠的平原边缘，大开大合。 “月涌”化静为动，大江滚滚东流，江心月影被江涛冲击汹涌翻卷，与“星垂”相对，苍茫不可方物。 “飘飘”叠字写出晚年形单影只、颠沛流离无依无靠的动荡生涯，语带凄怆自嘲。 “天地一沙鸥”千古神喻！在至大无垠的天地宇宙之间，诗人以一只渺小孤独的沙鸥自况，凄绝、旷绝、神绝！',
  '["细草微风岸","危樯独夜舟","星垂平野阔","月涌大江流","名岂文章著","官应老病休","飘飘何所似","天地一沙鸥"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"细草微风","options":["细草微风","春江秋风","孤舟清风","寒江宿雾"],"explanation":"“细草微风”写江岸近景，微风吹拂岸边柔弱细草，起笔轻柔，却为全诗浩瀚孤独埋下伏笔。","wrongExplanations":{"春江秋风":"造词拼凑，缺少身临其境的微观细腻感知。","孤舟清风":"“孤舟”与下句“独夜舟”意象重叠。","寒江宿雾":"语调过分滞重，不及“微风细草”之空灵。"}},{"lineIndex":1,"charIndex":2,"correct":"独夜舟","options":["独夜舟","一叶舟","羁旅舟","客夜舟"],"explanation":"“独夜舟”一个“独”字与“夜”字，将孤舟羁旅黑夜茫茫的绝大孤独凝注笔端。","wrongExplanations":{"一叶舟":"“一叶”偏向形体轻小，不如“独夜”兼收身世之孑然与时间之寂寞。","羁旅舟":"过于直白质木，破坏诗律节奏。","客夜舟":"平仄欠谐，不如“独夜舟”声情悲凉。"}},{"lineIndex":2,"charIndex":0,"correct":"星垂","options":["星垂","星临","月照","星落"],"explanation":"“星垂”二字雄奇无匹，荒野极其辽阔，远方星空仿佛垂挂在广袤无垠的平原边缘，大开大合。","wrongExplanations":{"星临":"“临”字偏静止，不如“垂”字极写平野浩瀚使得满天繁星垂至地平线之震撼错觉。","月照":"下联已有“月涌”，上联不可重复用“月”。","星落":"“落”字令人误作流星陨落，破坏了天地浩荡沉静的雄浑气度。"}},{"lineIndex":3,"charIndex":1,"correct":"涌","options":["涌","照","映","落"],"explanation":"“月涌”化静为动，大江滚滚东流，江心月影被江涛冲击汹涌翻卷，与“星垂”相对，苍茫不可方物。","wrongExplanations":{"照":"“照”字平庸无奇，全无江涛翻滚月影随之澎湃汹涌的壮阔动态。","映":"过于静态纤巧，缺乏浩浩荡荡的长江声势。","落":"破坏意境，缺乏“涌”字蓬勃奔腾之生命力。"}},{"lineIndex":6,"charIndex":0,"correct":"飘飘","options":["飘飘","漂泊","茫茫","孤身"],"explanation":"“飘飘”叠字写出晚年形单影只、颠沛流离无依无靠的动荡生涯，语带凄怆自嘲。","wrongExplanations":{"漂泊":"不如“飘飘”兼具羽毛飘零、居无定所的无力轻盈感。","茫茫":"偏向空间混沌，不及“飘飘”准确刻画孤身飞掠之态。","孤身":"太直白，缺少下文“沙鸥”之意象铺垫。"}},{"lineIndex":7,"charIndex":2,"correct":"一沙鸥","options":["一沙鸥","孤飞鸟","断梗蓬","一叶舟"],"explanation":"“天地一沙鸥”千古神喻！在至大无垠的天地宇宙之间，诗人以一只渺小孤独的沙鸥自况，凄绝、旷绝、神绝！","wrongExplanations":{"孤飞鸟":"寻常禽鸟，失却沙鸥常年漂泊水云之间、浪击天涯的沧桑特质。","断梗蓬":"浮萍蓬草虽合漂泊，但缺少生灵飞翔于天地苍茫间的精神孤傲。","一叶舟":"结句重复舟船意象，不如“沙鸥”飞腾翻飞直面宇宙之广博。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"xiangjiang","mood":{"sorrow":{"min":50},"homesickness":{"min":40}},"year_range":[765,770]}}'::jsonb,
  '["tang","shi","xiangjiang"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'ding_feng_bo',
  'su_shi',
  '定风波·莫听穿林打叶声',
  'song',
  1082,
  'huangzhou',
  '宋词词牌',
  '“莫听”起笔斩钉截铁，直抒宠辱不惊、不为外界风雨所动的从容与旷达。 “吟啸”兼具诗人的清雅与隐者的超脱，在暴雨骤风中自得其乐，尽显任真自得之风骨。 “烟雨”将自然风雨与人生浮沉化为江南水墨诗境，一蓑平生，旷达至极。 “也无风雨也无晴”乃全词画龙点睛之笔，道出超越顺逆荣辱、心如明镜、物我两忘的最高人生境界。',
  '["莫听穿林打叶声","何妨吟啸且徐行","竹杖芒鞋轻胜马","谁怕","一蓑烟雨任平生","料峭春风吹酒醒","微冷","山头斜照却相迎","回首向来萧瑟处","归去","也无风雨也无晴"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"莫听","options":["莫听","休听","不闻","且听"],"explanation":"“莫听”起笔斩钉截铁，直抒宠辱不惊、不为外界风雨所动的从容与旷达。","wrongExplanations":{"休听":"“休听”语气偏向柔婉劝诫，不如“莫听”斩钉截铁、坦荡旷达。","不闻":"“不闻”强作塞耳不闻之态，落入刻意，不如“莫听”任凭风雨之超然。","且听":"“且听”反成了细听风雨，与后句“何妨吟啸且徐行”从容之意相悖。"}},{"lineIndex":1,"charIndex":2,"correct":"吟啸","options":["吟啸","高歌","漫步","独步"],"explanation":"“吟啸”兼具诗人的清雅与隐者的超脱，在暴雨骤风中自得其乐，尽显任真自得之风骨。","wrongExplanations":{"高歌":"“高歌”过于亢奋外露，失却苏轼雨中竹杖芒鞋、闲庭信步的超脱神韵。","漫步":"“漫步”缺乏长啸破空的精神张力。","独步":"“独步”语境孤清凄凉，东坡此句虽遇骤雨，意境豁达无比。"}},{"lineIndex":4,"charIndex":2,"correct":"烟雨","options":["烟雨","风雨","沧浪","江海"],"explanation":"“烟雨”将自然风雨与人生浮沉化为江南水墨诗境，一蓑平生，旷达至极。","wrongExplanations":{"风雨":"“风雨”稍显直露粗砺，不若“烟雨”将自然风雨与人生风浪融为江南水墨之化境。","沧浪":"“沧浪”多涉避世隐逸，东坡身处江湖却从未自弃。","江海":"平仄不合词牌，且失却微雨空蒙的诗意质感。"}},{"lineIndex":10,"charIndex":0,"correct":"也无风雨也无晴","options":["也无风雨也无晴","休管风雨休管晴","任凭风雨任凭晴","不辞风雨不辞晴"],"explanation":"“也无风雨也无晴”乃全词画龙点睛之笔，道出超越顺逆荣辱、心如明镜、物我两忘的最高人生境界。","wrongExplanations":{"休管风雨休管晴":"流于市井口吻，失去千古名句超凡入圣的人生大哲思境界。","任凭风雨任凭晴":"仍有对抗风雨的执念，未到“也无风雨也无晴”的心如明镜、物我两忘。","不辞风雨不辞晴":"语意偏于勉强受之，缺少超然物外的通透顿悟。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"huangzhou","mood":{"freedom":{"min":60}},"year_range":[1080,1101]}}'::jsonb,
  '["song","ci","huangzhou"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'shui_diao_ge_tou',
  'su_shi',
  '水调歌头·明月几时有',
  'song',
  1076,
  'hangzhou',
  '宋词词牌',
  '“明月”对天发问，承接李太白《把酒问月》之气象，直探宇宙本源，澄澈空灵，气魄恢宏。 “乘风”浪漫超拔，写出欲羽化登仙、神游八极之道骨仙风，深契庄子御风之超脱。 “但愿”寄托了对天下离人最温厚真挚的祝祷，展现东坡由超然物外复归关切人间的博大情怀。',
  '["明月几时有","把酒问青天","不知天上宫阙","今夕是何年","我欲乘风归去","又恐琼楼玉宇","高处不胜寒","起舞弄清影","何似在人间","但愿人长久","千里共婵娟"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"明月","options":["明月","皓月","金波","玉兔"],"explanation":"“明月”对天发问，承接李太白《把酒问月》之气象，直探宇宙本源，澄澈空灵，气魄恢宏。","wrongExplanations":{"皓月":"虽状月白，不如“明月”天然清澈，直承李太白“青天有月来几时”之问。","金波":"借代过繁，失去了中秋月圆纯净清冽的诗境。","玉兔":"借代俗套，与此词开篇发问苍天的哲理气质不合。"}},{"lineIndex":4,"charIndex":2,"correct":"乘风","options":["乘风","凌空","驾云","逐月"],"explanation":"“乘风”浪漫超拔，写出欲羽化登仙、神游八极之道骨仙风，深契庄子御风之超脱。","wrongExplanations":{"凌空":"“凌空”偏重动作姿态，不及“乘风”羽化登仙之道骨仙风。","驾云":"偏向神魔小说写实手法，失去诗性空灵感。","逐月":"语意重复，前文已有明月。"}},{"lineIndex":9,"charIndex":0,"correct":"但愿","options":["但愿","唯愿","只求","安得"],"explanation":"“但愿”寄托了对天下离人最温厚真挚的祝祷，展现东坡由超然物外复归关切人间的博大情怀。","wrongExplanations":{"唯愿":"“唯愿”口吻稍生硬，不如“但愿”温柔包容、情意绵长。","只求":"“只求”格局偏小，缺少博大的人间情怀。","安得":"“安得”多用于杜甫式沉郁顿挫的沉痛呼唤，与东坡超然旷达之祝愿不符。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"hangzhou","mood":{"homesickness":{"min":60},"freedom":{"min":50}},"year_range":[1070,1101]}}'::jsonb,
  '["song","ci","hangzhou"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'ru_meng_ling_xi_ting',
  'li_qingzhao',
  '如梦令·常记溪亭日暮',
  'song',
  1100,
  'jinan',
  '宋词词牌',
  '“常记”二字如闲话家常，写出这段青春郊游记忆在才女心头时时泛起、挥之不去的眷恋与亲切。 “沉醉”既是酒醉，更是为大自然泉石荷花之美而陶醉，身心沉浸，妙不可言。 “误入”二字神采飞扬，写出小舟荡漾、荷叶接天，不经意间撞入千竿万朵荷花深处的惊喜与天然情趣。 “争渡”即怎渡、抢着划船，叠句急促跳跃，活灵活现展现少女们娇呼抢桨、急寻归路的活泼场景。 “鸥鹭”洁白高雅，双声清脆，小舟穿花惊飞水鸟扑棱掠水，声色动静在此刻定格为千古如画奇景！',
  '["常记溪亭日暮","沉醉不知归路","兴尽晚回舟","误入藕花深处","争渡争渡","惊起一滩鸥鹭"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"常记","options":["常记","忆昔","难忘","曾记"],"explanation":"“常记”二字如闲话家常，写出这段青春郊游记忆在才女心头时时泛起、挥之不去的眷恋与亲切。","wrongExplanations":{"忆昔":"“忆昔”书卷气过重，缺乏少女天真烂漫的回味感。","难忘":"直白浅露，缺少词调的温存流转。","曾记":"偏重于偶发回想，不如“常记”写出此景在心中历历如昨、屡屡忆及的欢欣。"}},{"lineIndex":1,"charIndex":0,"correct":"沉醉","options":["沉醉","尽醉","微醺","大醉"],"explanation":"“沉醉”既是酒醉，更是为大自然泉石荷花之美而陶醉，身心沉浸，妙不可言。","wrongExplanations":{"尽醉":"过于着重饮酒数量，缺少迷醉于山水荷香的艺术陶然之美。","微醺":"程度太浅，难以解释“不知归路”的娇憨迷途之态。","大醉":"俗滥粗豪，与名门闺秀清新雅致的词格不合。"}},{"lineIndex":3,"charIndex":0,"correct":"误入","options":["误入","深入","迷入","行入"],"explanation":"“误入”二字神采飞扬，写出小舟荡漾、荷叶接天，不经意间撞入千竿万朵荷花深处的惊喜与天然情趣。","wrongExplanations":{"深入":"显得故意为之，缺少灵动偶得的意外之喜。","迷入":"意境滞重，不及“误入”充满青春淘气的轻盈神韵。","行入":"平铺直叙，毫无词意张力。"}},{"lineIndex":4,"charIndex":0,"correct":"争渡","options":["争渡","快划","回棹","急渡"],"explanation":"“争渡”即怎渡、抢着划船，叠句急促跳跃，活灵活现展现少女们娇呼抢桨、急寻归路的活泼场景。","wrongExplanations":{"快划":"市井俗语，毫无宋词乐府音乐节拍之美。","回棹":"文雅端凝，缺少仓促焦急而又欢闹的气氛。","急渡":"不如“争渡”叠字那般富有声色与律动感。"}},{"lineIndex":5,"charIndex":2,"correct":"鸥鹭","options":["鸥鹭","水鸟","飞鸟","野鹜"],"explanation":"“鸥鹭”洁白高雅，双声清脆，小舟穿花惊飞水鸟扑棱掠水，声色动静在此刻定格为千古如画奇景！","wrongExplanations":{"水鸟":"泛称平庸，缺少“鸥鹭”雪白羽翅划破荷塘暮色的诗意画面感。","飞鸟":"未能体现水边沙滩特有的栖息禽类。","野鹜":"缺乏空灵雅致的美感。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"jinan","mood":{"freedom":{"min":40}},"year_range":[1098,1103]}}'::jsonb,
  '["song","ci","jinan"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'yi_jian_mei',
  'li_qingzhao',
  '一剪梅·红藕香残玉簟秋',
  'song',
  1104,
  'kaifeng',
  '宋词词牌',
  '“红藕香残”写池中红荷凋谢、幽香消散，起笔工丽幽渺，由物候之变自然牵动深闺冷落之感。 “独上兰舟”一个“独”字点醒全篇孤寂，独自乘舟泛波，相思无处安放。 “锦书”化用窦滔妻苏蕙织锦回文诗之典，深情款款，期盼远方丈夫寄来书信。 “月满西楼”景阔情深，大雁排成人字形飞回，清冷的月光洒满了西楼，空灵无际。 “一种相思，两处闲愁”心心相印，写出夫妻虽各处异地，但心中挂念彼此之相思却浑然相同。 “才下眉头，却上心头”千古名句！眉头刚刚舒展，心口却又被思念紧紧揪住，将相思的无从排遣写活！',
  '["红藕香残玉簟秋","轻解罗裳独上兰舟","云中谁寄锦书来","雁字回时月满西楼","花自飘零水自流","一种相思两处闲愁","此情无计可消除","才下眉头却上心头"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"红藕香残","options":["红藕香残","白莲凋零","荷花开尽","秋风吹尽"],"explanation":"“红藕香残”写池中红荷凋谢、幽香消散，起笔工丽幽渺，由物候之变自然牵动深闺冷落之感。","wrongExplanations":{"白莲凋零":"不如“红藕”兼具色泽之温存与“藕断丝连”的相思双关。","荷花开尽":"直白乏味，缺少“香残”那一抹微风过处的幽微嗅觉感受。","秋风吹尽":"过于宏阔，失却闺阁庭院之细腻情境。"}},{"lineIndex":1,"charIndex":4,"correct":"独上兰舟","options":["独上兰舟","漫步兰舟","泛舟中流","独立芳洲"],"explanation":"“独上兰舟”一个“独”字点醒全篇孤寂，独自乘舟泛波，相思无处安放。","wrongExplanations":{"漫步兰舟":"小船摇曳不可“漫步”，动词生硬失准。","泛舟中流":"流于常规泛舟之叙，缺少形单影只的深闺惆怅。","独立芳洲":"改变了乘舟水上寻觅寄托的原意境。"}},{"lineIndex":2,"charIndex":2,"correct":"锦书","options":["锦书","尺素","家书","寸简"],"explanation":"“锦书”化用窦滔妻苏蕙织锦回文诗之典，深情款款，期盼远方丈夫寄来书信。","wrongExplanations":{"尺素":"虽合书信之典，但不如“锦书”带有闺阁织锦情深的古典雅意。","家书":"过于日常通俗，失却词苑高华之调。","寸简":"用语僻涩，声律不畅。"}},{"lineIndex":3,"charIndex":4,"correct":"月满西楼","options":["月满西楼","夜上西楼","独立小楼","冷落重楼"],"explanation":"“月满西楼”景阔情深，大雁排成人字形飞回，清冷的月光洒满了西楼，空灵无际。","wrongExplanations":{"夜上西楼":"只写动作时间，缺少“月华满楼”那种清辉洒遍的明净空寂感。","独立小楼":"平淡质木，缺少清辉如水的视觉冲击。","冷落重楼":"造语过露，反损蕴藉神韵。"}},{"lineIndex":5,"charIndex":2,"correct":"相思","options":["相思","深情","离愁","幽怀"],"explanation":"“一种相思，两处闲愁”心心相印，写出夫妻虽各处异地，但心中挂念彼此之相思却浑然相同。","wrongExplanations":{"深情":"不若“相思”精准对仗下联“闲愁”。","离愁":"下文已有“闲愁”，上联不可重复用“愁”。","幽怀":"过于抽象内敛，缺少“相思”相向奔赴的情感互通。"}},{"lineIndex":7,"charIndex":0,"correct":"才下眉头","options":["才下眉头","既下眉宇","初解愁颜","方隐双眉"],"explanation":"“才下眉头，却上心头”千古名句！眉头刚刚舒展，心口却又被思念紧紧揪住，将相思的无从排遣写活！","wrongExplanations":{"既下眉宇":"文绉生硬，完全破坏了宋词行云流水般的语感。","初解愁颜":"浅白失韵，毫无原句“才下...却上...”的神妙递进。","方隐双眉":"语意扭捏晦涩。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"kaifeng","mood":{"homesickness":{"min":40}},"year_range":[1101,1107]}}'::jsonb,
  '["song","ci","kaifeng"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'sheng_sheng_man',
  'li_qingzhao',
  '声声慢·寻寻觅觅',
  'song',
  1134,
  'hangzhou',
  '宋词词牌',
  '连用十四个叠字开篇，前无古人！“寻寻觅觅”写出人在神魂颠倒、若有所失之际盲目摸索寻找的绝大空白与迷惘。 “冷冷清清”写寻找无果后所面对的客观环境与身心感受之凄寒，承前启后。 连用六字齿舌促音，如疾风骤雨般将内心无法承受的悲怆哭泣感推向极致，千古创调！ “将息”为宋代方言俚语，意为调养、休养，入词自然质朴，道尽老病孤苦之凄酸。 “怎敌他”用口语入词，一个“敌”字赋予急风以扑面袭人的凶恶动态，淡酒不胜风寒之悲跃然纸上。 “旧时相识”神来之笔！大雁本无情，但南渡前在北方曾见，如今江南重逢，国亡夫死，鸟犹似旧，人何以堪！ “憔悴损”既写菊花枯萎凋残，更写自身容颜消瘦、心力交瘁，物我合一，悲怆至极。 “点点滴滴”摹写雨打梧桐的凄凉音响，声声敲在孤苦无依的诗人心头，如断肠之泪。 “怎一个愁字了得”！此情此景，国破、家亡、夫死、金石散佚、自身流亡，世间哪是一个“愁”字能够承载包容得了的！',
  '["寻寻觅觅","冷冷清清","凄凄惨惨戚戚","乍暖还寒时候","最难将息","三杯两盏淡酒","怎敌他晚来风急","雁过也正伤心","却是旧时相识","满地黄花堆积","憔悴损如今有谁堪摘","守着窗儿独自怎生得黑","梧桐更兼细雨","到黄昏点点滴滴","这次第怎一个愁字了得"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"寻寻觅觅","options":["寻寻觅觅","凄凄切切","茫茫荡荡","孤孤单单"],"explanation":"连用十四个叠字开篇，前无古人！“寻寻觅觅”写出人在神魂颠倒、若有所失之际盲目摸索寻找的绝大空白与迷惘。","wrongExplanations":{"凄凄切切":"不如“寻寻觅觅”带有若有所失、心神失落的具体动作性。","茫茫荡荡":"偏向空间空阔，不及“寻寻觅觅”从内心情神破空而入。","孤孤单单":"浅近俗白，破坏十四叠字的奇绝韵律。"}},{"lineIndex":1,"charIndex":0,"correct":"冷冷清清","options":["冷冷清清","凄凄凉凉","沉沉寂寂","幽幽静静"],"explanation":"“冷冷清清”写寻找无果后所面对的客观环境与身心感受之凄寒，承前启后。","wrongExplanations":{"凄凄凉凉":"声韵过于滞涩，与下文“凄凄惨惨戚戚”重叠。","沉沉寂寂":"声律不合齿音喉音之跌宕。","幽幽静静":"语意过分安详，与国破家亡的彻骨悲痛不合。"}},{"lineIndex":2,"charIndex":0,"correct":"凄凄惨惨戚戚","options":["凄凄惨惨戚戚","悲悲伤伤戚戚","愁愁苦苦凄凄","孤孤零零戚戚"],"explanation":"连用六字齿舌促音，如疾风骤雨般将内心无法承受的悲怆哭泣感推向极致，千古创调！","wrongExplanations":{"悲悲伤伤戚戚":"音韵平钝，完全丧失了原句连珠炮般的齿舌入声清厉凄咽之声调。","愁愁苦苦凄凄":"过于直白，缺少“惨惨戚戚”那份撕心裂肺的战栗感。","孤孤零零戚戚":"韵律不调。"}},{"lineIndex":4,"charIndex":2,"correct":"将息","options":["将息","安歇","消受","存活"],"explanation":"“将息”为宋代方言俚语，意为调养、休养，入词自然质朴，道尽老病孤苦之凄酸。","wrongExplanations":{"安歇":"局限于睡眠，不如“将息”包含整个身体病骨的调摄调养。","消受":"偏向享受，与凄风苦雨难耐之语境相悖。","存活":"直白粗俗。"}},{"lineIndex":6,"charIndex":1,"correct":"敌他","options":["敌他","耐得","当得","受得"],"explanation":"“怎敌他”用口语入词，一个“敌”字赋予急风以扑面袭人的凶恶动态，淡酒不胜风寒之悲跃然纸上。","wrongExplanations":{"耐得":"不如“敌他”带有与命运和寒风顽强相搏的抗争悲感。","当得":"语力稍弱。","受得":"过于被动消极，缺少宋词语势的劲健。"}},{"lineIndex":8,"charIndex":2,"correct":"旧时相识","options":["旧时相识","北来鸿雁","中原旧友","归乡过客"],"explanation":"“旧时相识”神来之笔！大雁本无情，但南渡前在北方曾见，如今江南重逢，国亡夫死，鸟犹似旧，人何以堪！","wrongExplanations":{"北来鸿雁":"直陈事实，缺少“相识”这一拟人化带来的撕心裂肺之痛。","中原旧友":"字义坐实，缺少诗词的含蓄与回味。","归乡过客":"不如“旧时相识”勾连起往昔繁华汴京与今日飘零江南的巨大反差。"}},{"lineIndex":10,"charIndex":0,"correct":"憔悴损","options":["憔悴损","零落尽","凋谢尽","飘零尽"],"explanation":"“憔悴损”既写菊花枯萎凋残，更写自身容颜消瘦、心力交瘁，物我合一，悲怆至极。","wrongExplanations":{"零落尽":"只重花瓣掉落，缺少“憔悴”所赋予的人格化衰败与痛楚。","凋谢尽":"平铺描写，无情感附着。","飘零尽":"与下句“有谁堪摘”缺乏憔悴无力之神韵连接。"}},{"lineIndex":13,"charIndex":3,"correct":"点点滴滴","options":["点点滴滴","声声凄凄","纷纷洒洒","断断续续"],"explanation":"“点点滴滴”摹写雨打梧桐的凄凉音响，声声敲在孤苦无依的诗人心头，如断肠之泪。","wrongExplanations":{"声声凄凄":"过于概念化，缺少雨点敲打枯叶的具象声音摹状。","纷纷洒洒":"轻快舒展，与黄昏绝望之死寂完全不合。","断断续续":"不如“点点滴滴”有敲击心灵的持续钝痛感。"}},{"lineIndex":14,"charIndex":4,"correct":"愁","options":["愁","恨","痛","苦"],"explanation":"“怎一个愁字了得”！此情此景，国破、家亡、夫死、金石散佚、自身流亡，世间哪是一个“愁”字能够承载包容得了的！","wrongExplanations":{"恨":"“恨”偏狭于愤怨，包容不下这无边无际的荒凉与孤独。","痛":"过于直露肌肉之痛，失却宋词融万千哀感于深沉蕴藉中的最高功力。","苦":"“苦”字质木，不如“愁”字为全词所有哀音之总汇与突破。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"hangzhou","mood":{"sorrow":{"min":70}},"year_range":[1132,1140]}}'::jsonb,
  '["song","ci","hangzhou"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'xia_ri_jue_ju',
  'li_qingzhao',
  '夏日绝句',
  'song',
  1129,
  'jiankang',
  '近体古诗',
  '“生当作”气贯长虹，开篇立下堂堂正正做人立命的至高标准，慷慨雄壮。 “鬼雄”化用屈原《九歌·国殇》“身既死兮神以灵，魂魄毅兮为鬼雄”，写英雄死后灵魂亦当威震天地！ “思项羽”直指西楚霸王兵败垓下溃围乌江、宁死不辱之决绝，借古讽今力透纸背。 “不肯”二字重逾泰山！项羽非不能过江，而是为了尊严“不肯”偷生苟活，辛辣痛刺南宋朝廷与赵明诚南逃弃城之苟安！',
  '["生当作人杰","死亦为鬼雄","至今思项羽","不肯过江东"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"生当作","options":["生当作","生当为","为人当","活当作"],"explanation":"“生当作”气贯长虹，开篇立下堂堂正正做人立命的至高标准，慷慨雄壮。","wrongExplanations":{"生当为":"声调偏弱，不如“作”字发音短促有力。","为人当":"说教味重，缺乏英雄豪迈之磅礴语势。","活当作":"口语粗糙，不合五言绝句骨力。"}},{"lineIndex":1,"charIndex":2,"correct":"鬼雄","options":["鬼雄","英魂","雄杰","烈魄"],"explanation":"“鬼雄”化用屈原《九歌·国殇》“身既死兮神以灵，魂魄毅兮为鬼雄”，写英雄死后灵魂亦当威震天地！","wrongExplanations":{"英魂":"偏向哀悼凄惋，不如“鬼雄”带睥睨千秋的昂扬霸气。","雄杰":"与上句“人杰”字面犯复。","烈魄":"僻涩生硬。"}},{"lineIndex":2,"charIndex":2,"correct":"思项羽","options":["思项羽","忆霸王","思英雄","念西楚"],"explanation":"“思项羽”直指西楚霸王兵败垓下溃围乌江、宁死不辱之决绝，借古讽今力透纸背。","wrongExplanations":{"忆霸王":"“霸王”流于民间演义色彩，不如直书“项羽”沉重刚烈。","思英雄":"空泛无落脚点，无法与下文“不肯过江东”之史实相扣。","念西楚":"概念含混，不及项羽一人之悲壮决绝来得震撼。"}},{"lineIndex":3,"charIndex":0,"correct":"不肯","options":["不肯","羞于","誓不","未曾"],"explanation":"“不肯”二字重逾泰山！项羽非不能过江，而是为了尊严“不肯”偷生苟活，辛辣痛刺南宋朝廷与赵明诚南逃弃城之苟安！","wrongExplanations":{"羞于":"说破了心理，反不如“不肯”带有顶天立地的主动尊严。","誓不":"过于做作，不及“不肯”蕴含坚守气节的悲壮大义。","未曾":"客观陈述，丧失了讽刺南逃苟安群丑的千钧批判力。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"jiankang","mood":{"anger":{"min":40},"passion":{"min":40}},"year_range":[1128,1131]}}'::jsonb,
  '["song","shi","jiankang"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'wu_ling_chun',
  'li_qingzhao',
  '武陵春·春晚',
  'song',
  1135,
  'hangzhou',
  '宋词词牌',
  '“风住尘香”四字写狂风停息，落花已化为泥土，唯有泥尘中尚残留缕缕余香，摹写暮春凄清神绝。 “倦梳头”写尽心力交瘁、万念俱灰之深沉疲倦，所谓“女为悦己者容”，知己已逝，梳妆给谁看？ “物是人非”千古共情！山河庭院旧物尚存，而挚爱亲人与太平盛世已彻底荡然无存，八字沉痛！ “欲语泪先流”未曾开口，热泪已夺眶而出，痛苦到了极点反而无法用言语诉说，悲怆至极。 “舴艋舟”指形如蚱蜢的小型轻舟，以船之狭小轻巧，与后句“载不动许多愁”形成惊绝古今之对比！ “只恐双溪舴艋舟，载不动许多愁”化无形之愁为有千钧重量之巨物，构思奇绝磅礴，千古神笔！',
  '["风住尘香花已尽","日晚倦梳头","物是人非事事休","欲语泪先流","闻说双溪春尚好","也拟泛轻舟","只恐双溪舴艋舟","载不动许多愁"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"风住尘香","options":["风住尘香","花落香残","雨打风吹","春残风驻"],"explanation":"“风住尘香”四字写狂风停息，落花已化为泥土，唯有泥尘中尚残留缕缕余香，摹写暮春凄清神绝。","wrongExplanations":{"花落香残":"流于平庸俗套，不如“尘香”写落红委地入土的沧桑深刻。","雨打风吹":"过于喧嚣动态，不如“风住”显狂风暴虐过后死寂的悲凉。","春残风驻":"语带生硬造作。"}},{"lineIndex":1,"charIndex":2,"correct":"倦梳头","options":["倦梳头","懒梳头","未梳头","懒临镜"],"explanation":"“倦梳头”写尽心力交瘁、万念俱灰之深沉疲倦，所谓“女为悦己者容”，知己已逝，梳妆给谁看？","wrongExplanations":{"懒梳头":"“懒”字偏于日常怠惰娇慵，不及“倦”字力透纸背的心力交瘁与绝望。","未梳头":"直陈事实，缺少疲惫颓然的神态刻画。","懒临镜":"失却古词闺阁细节的传神。"}},{"lineIndex":2,"charIndex":0,"correct":"物是人非","options":["物是人非","世事沧桑","岁暮天寒","昔景犹在"],"explanation":"“物是人非”千古共情！山河庭院旧物尚存，而挚爱亲人与太平盛世已彻底荡然无存，八字沉痛！","wrongExplanations":{"世事沧桑":"过于泛化宏大，不及“物是人非”直切亲人逝去、物在人亡之撕心剧痛。","岁暮天寒":"只言天气，缺少人事巨变的大悲哀。","昔景犹在":"平淡无力。"}},{"lineIndex":3,"charIndex":2,"correct":"泪先流","options":["泪先流","泪满流","暗垂泪","空自愁"],"explanation":"“欲语泪先流”未曾开口，热泪已夺眶而出，痛苦到了极点反而无法用言语诉说，悲怆至极。","wrongExplanations":{"泪满流":"粗陋直白，失却“欲言又止、泪已先涌”的绝大哀伤。","暗垂泪":"缺少与“欲语”这一动作的强烈因果连接。","空自愁":"平淡泛言，全无泪水决堤的真实生理震颤。"}},{"lineIndex":6,"charIndex":4,"correct":"舴艋舟","options":["舴艋舟","一叶舟","小兰舟","画舫舟"],"explanation":"“舴艋舟”指形如蚱蜢的小型轻舟，以船之狭小轻巧，与后句“载不动许多愁”形成惊绝古今之对比！","wrongExplanations":{"一叶舟":"不如“舴艋舟”形象如昆虫般纤小脆弱，对比更具张力。","小兰舟":"带闺阁闲适感，破坏了载愁难堪重负的奇崛构思。","画舫舟":"画舫笨重华丽，完全违背了轻舟载不动沉重愁苦的哲理反差。"}},{"lineIndex":7,"charIndex":0,"correct":"载不动","options":["载不动","装不下","承不起","难载得"],"explanation":"“只恐双溪舴艋舟，载不动许多愁”化无形之愁为有千钧重量之巨物，构思奇绝磅礴，千古神笔！","wrongExplanations":{"装不下":"口语鄙俗，毫无词意张力。","承不起":"音律滞涩。","难载得":"不及“载不动”干脆利落、化虚为实之重量感。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"hangzhou","mood":{"sorrow":{"min":55}},"year_range":[1134,1140]}}'::jsonb,
  '["song","ci","hangzhou"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  'yu_jia_ao_tian_jie',
  'li_qingzhao',
  '渔家傲·天接云涛连晓雾',
  'song',
  1130,
  'hangzhou',
  '宋词词牌',
  '“天接云涛”开篇海天苍茫、云浪翻涌如涛，与晨雾浑然相接，气势雄浑奇拔，宛如九霄太虚。 “千帆舞”写出银河欲转、海面上千万帆樯在风浪中翻飞起舞的壮丽天风海浪景象！ “闻天语”承接屈原《楚辞》九歌遗韵，天帝在云端殷勤温言垂询，浪漫奇诡至极。 “我报路长嗟日暮”化用屈原《离骚》“路曼曼其修远兮，吾将上下而求索”，道出平生抱负难以施展的无尽悲慨。 “谩有”意为空有、徒有，满腹诗书惊才绝艳，却生逢乱世无从补天，化用杜甫诗句，自负而又悲凉。 “九万里风鹏正举”化用《庄子·逍遥游》大鹏展翅九万里之典，狂放博大，彻底摆脱闺阁纤细之气！ “风休住，蓬舟吹取三山去！”千古豪迈绝调！大风啊千万不要停息，把我的这一叶孤舟吹向海中蓬莱三神山吧！浩瀚超脱，气吞银河！',
  '["天接云涛连晓雾","星河欲转千帆舞","仿佛梦魂归帝所","闻天语殷勤问我归何处","我报路长嗟日暮","学诗谩有惊人句","九万里风鹏正举","风休住蓬舟吹取三山去"]'::jsonb,
  '[{"lineIndex":0,"charIndex":0,"correct":"天接云涛","options":["天接云涛","海阔天空","云海苍茫","沧海横流"],"explanation":"“天接云涛”开篇海天苍茫、云浪翻涌如涛，与晨雾浑然相接，气势雄浑奇拔，宛如九霄太虚。","wrongExplanations":{"海阔天空":"成语平铺陈腐，缺少波涛如云滚滚相连的磅礴动感。","云海苍茫":"略嫌静止，缺少江海激荡的大气派。","沧海横流":"语涉政治动乱，破坏了浪漫瑰丽的神话意境。"}},{"lineIndex":1,"charIndex":4,"correct":"千帆舞","options":["千帆舞","千帆过","扁舟泛","千帆度"],"explanation":"“千帆舞”写出银河欲转、海面上千万帆樯在风浪中翻飞起舞的壮丽天风海浪景象！","wrongExplanations":{"千帆过":"平淡无奇，不及“舞”字生动展现风涛狂澜中千帆起伏跃动的神采。","扁舟泛":"缩小了气象，破坏了海天万帆竞发的豪迈气魄。","千帆度":"缺乏节奏律动美。"}},{"lineIndex":3,"charIndex":0,"correct":"闻天语","options":["闻天语","见上帝","天神问","帝所闻"],"explanation":"“闻天语”承接屈原《楚辞》九歌遗韵，天帝在云端殷勤温言垂询，浪漫奇诡至极。","wrongExplanations":{"见上帝":"现代口语化违和，古意尽失。","天神问":"浅直质木，失却天帝话语之崇高神秘感。","帝所闻":"句式颠倒欠谐。"}},{"lineIndex":4,"charIndex":2,"correct":"路长","options":["路长","道远","途穷","日迟"],"explanation":"“我报路长嗟日暮”化用屈原《离骚》“路曼曼其修远兮，吾将上下而求索”，道出平生抱负难以施展的无尽悲慨。","wrongExplanations":{"道远":"平仄欠叶，不如“路长”与“日暮”天然对举。","途穷":"显走投无路之颓丧，不及“路长嗟日暮”包含前路漫漫而生命向晚之深沉执着。","日迟":"与后文“日暮”形成重复。"}},{"lineIndex":5,"charIndex":2,"correct":"谩有","options":["谩有","空有","徒有","自有"],"explanation":"“谩有”意为空有、徒有，满腹诗书惊才绝艳，却生逢乱世无从补天，化用杜甫诗句，自负而又悲凉。","wrongExplanations":{"空有":"不如“谩有”兼具唐宋词人特有的自嘲与苍凉傲骨。","徒有":"造语微硬，音韵不及“谩”字悠长。","自有":"纯为自夸，丢失了空负惊人词句却无以救世的时代悲叹。"}},{"lineIndex":6,"charIndex":0,"correct":"九万里风","options":["九万里风","六月息风","万里长风","扶摇直上"],"explanation":"“九万里风鹏正举”化用《庄子·逍遥游》大鹏展翅九万里之典，狂放博大，彻底摆脱闺阁纤细之气！","wrongExplanations":{"六月息风":"虽合庄子典故，但语势滞涩，全无长风呼啸之磅礴。","万里长风":"不如“九万里”写出九天凌霄之绝高境界。","扶摇直上":"成语平衍，不如原句气象非凡。"}},{"lineIndex":7,"charIndex":0,"correct":"风休住","options":["风休住","风莫停","狂风起","任天风"],"explanation":"“风休住，蓬舟吹取三山去！”千古豪迈绝调！大风啊千万不要停息，把我的这一叶孤舟吹向海中蓬莱三神山吧！浩瀚超脱，气吞银河！","wrongExplanations":{"风莫停":"浅白口语，不及“休住”带有祈请风神相送的高古神韵。","狂风起":"只写起风，缺少乘风直上海中仙山的浪漫决绝。","任天风":"被动随波逐流，缺少“吹取三山去”的主动高飞追求。"}}]'::jsonb,
  '{"trigger_conditions":{"location_id":"hangzhou","mood":{"freedom":{"min":65}},"year_range":[1129,1135]}}'::jsonb,
  '["song","ci","hangzhou"]'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;

-- 5. 人生重大历史纪事与分支抉择
INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'li_bai_youth_sichuan',
  'li_bai',
  701,
  'sichuan',
  '蜀中仗剑',
  'travel',
  '二十四岁，李白别父母、离故里，仗剑去国，辞亲远游，沿长江顺流东下。',
  '二十四岁，李白别父母、离故里，仗剑去国，辞亲远游，沿长江顺流东下。',
  NULL,
  '[]'::jsonb,
  '{"freedom":15,"passion":20}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"li_bai_visit_lu_shan_726"}'::jsonb,
  1
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'li_bai_visit_lu_shan_726',
  'li_bai',
  726,
  'lu_shan',
  '初登庐山',
  'travel',
  '首次登临庐山香炉峰，见飞瀑垂天，水汽化为紫气，心潮澎湃，写下《望庐山瀑布》！',
  '首次登临庐山香炉峰，见飞瀑垂天，水汽化为紫气，心潮澎湃，写下《望庐山瀑布》！',
  'wang_lu_shan_pu_bu',
  '[]'::jsonb,
  '{"freedom":25,"passion":25}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"li_bai_yangzhou_726"}'::jsonb,
  2
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'li_bai_yangzhou_726',
  'li_bai',
  726,
  'yangzhou',
  '客居扬州',
  'travel',
  '初秋游历广陵扬州，散金三十万，后深秋染疾，孤卧客舍，月色照床，挥毫写下千古《静夜思》。',
  '初秋游历广陵扬州，散金三十万，后深秋染疾，孤卧客舍，月色照床，挥毫写下千古《静夜思》。',
  'jing_ye_si',
  '[]'::jsonb,
  '{"homesickness":35,"sorrow":20,"freedom":-10}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"li_bai_huanghelou_727"}'::jsonb,
  3
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'li_bai_huanghelou_727',
  'li_bai',
  727,
  'huanghelou',
  '江夏送孟浩然',
  'meeting',
  '与诗坛前辈孟浩然一见倾心，暮春三月在黄鹤楼为其设宴壮行，目送孤帆远影碧空尽。',
  '与诗坛前辈孟浩然一见倾心，暮春三月在黄鹤楼为其设宴壮行，目送孤帆远影碧空尽。',
  'huang_he_lou_song_meng_hao_ran',
  '[]'::jsonb,
  '{"freedom":20,"sorrow":10}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"li_bai_imperial_summon_742"}'::jsonb,
  4
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'li_bai_imperial_summon_742',
  'li_bai',
  742,
  'chang_an',
  '玄宗奉诏入京',
  'choice',
  '四十二岁，唐玄宗亲下诏书召入长安，“仰天大笑出门去，我辈岂是蓬蒿人”。长安市上酒中仙，初作《蜀道难》震撼贺知章。',
  '四十二岁，唐玄宗亲下诏书召入长安，“仰天大笑出门去，我辈岂是蓬蒿人”。长安市上酒中仙，初作《蜀道难》震撼贺知章。',
  'shu_dao_nan',
  '[{"id":"choice_742_court","event_id":"li_bai_imperial_summon_742","prompt":"天宝元年，唐玄宗亲下诏书召你入长安供奉翰林。文人济世与终身自由，如何抉择？","historical_context":"历史上李白毅然入京，“仰天大笑出门去，我辈岂是蓬蒿人”。但入宫仅三年即遭排挤赐金放还。","options":[{"id":"opt_court_accept","text":"接受诏命，入宫供奉翰林（历史正史）","mood_delta":{"passion":25,"freedom":-20,"anger":10},"unlocks_poems":["shu_dao_nan","qing_ping_diao"],"unlocks_locations":["chang_an"],"is_historical":true,"historical_note":"李白选择了入宫。三年翰林生涯虽郁郁不得志，却促成了他走出宫廷后更伟大的诗篇。"},{"id":"opt_court_decline","text":"婉拒诏命，继续放浪山水（平行历史）","mood_delta":{"freedom":35,"passion":10,"homesickness":-10},"unlocks_poems":["shu_dao_nan"],"unlocks_locations":["lu_shan","sichuan"],"is_historical":false,"historical_note":"若李白拒绝了玄宗诏书，他将保留终身纯净的山水仙气，但中国文学史上或将缺少《行路难》的沉郁悲歌。"}]}]'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"li_bai_court_life_743"}'::jsonb,
  5
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'li_bai_court_life_743',
  'li_bai',
  743,
  'chang_an',
  '沉香亭召见',
  'appointment',
  '入宫为供奉翰林，玄宗与杨贵妃于兴庆宫沉香亭赏牡丹，召李白醉中作新平调词三首，“云想衣裳花想容”名动六宫。',
  '入宫为供奉翰林，玄宗与杨贵妃于兴庆宫沉香亭赏牡丹，召李白醉中作新平调词三首，“云想衣裳花想容”名动六宫。',
  'qing_ping_diao',
  '[]'::jsonb,
  '{"passion":20,"freedom":-15}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"li_bai_leaves_changan_744"}'::jsonb,
  6
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'li_bai_leaves_changan_744',
  'li_bai',
  744,
  'luoyang',
  '赐金放还·行路难',
  'travel',
  '遭权贵谗毁，玄宗“赐金放还”。李白傲岸离京，前路茫茫，拔剑四顾，高唱“长风破浪会有时，直挂云帆济沧海”！',
  '遭权贵谗毁，玄宗“赐金放还”。李白傲岸离京，前路茫茫，拔剑四顾，高唱“长风破浪会有时，直挂云帆济沧海”！',
  'xing_lu_nan',
  '[]'::jsonb,
  '{"anger":35,"freedom":25,"sorrow":20}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"li_bai_meets_du_fu_744"}'::jsonb,
  7
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'li_bai_meets_du_fu_744',
  'li_bai',
  744,
  'luoyang',
  '洛阳初逢杜甫 · 双星并峙',
  'meeting',
  '在东都洛阳遇见了三十三岁的杜甫与高适，三人携手登高、策马狂歌，中国文学史双星最耀眼的交汇！',
  '在东都洛阳遇见了三十三岁的杜甫与高适，三人携手登高、策马狂歌，中国文学史双星最耀眼的交汇！',
  NULL,
  '[]'::jsonb,
  '{"freedom":25,"passion":25,"anger":-10}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"li_bai_yingyang_752"}'::jsonb,
  8
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'li_bai_yingyang_752',
  'li_bai',
  752,
  'yingyang',
  '颍阳醉歌',
  'travel',
  '与好友岑勋、元丹丘相会颍阳，痛饮千钟，借酒浇胸中块垒，千古第一劝酒狂歌《将进酒》横空出世！',
  '与好友岑勋、元丹丘相会颍阳，痛饮千钟，借酒浇胸中块垒，千古第一劝酒狂歌《将进酒》横空出世！',
  'qiang_jin_jiu',
  '[]'::jsonb,
  '{"passion":40,"freedom":30}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"li_bai_jingxian_753"}'::jsonb,
  9
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'li_bai_jingxian_753',
  'li_bai',
  753,
  'jingxian',
  '桃花潭别汪伦',
  'meeting',
  '应汪伦“万家酒店、十里桃花”之邀游宣城泾县桃花潭，临行之际汪伦踏歌相送，写下千古送别绝句《赠汪伦》。',
  '应汪伦“万家酒店、十里桃花”之邀游宣城泾县桃花潭，临行之际汪伦踏歌相送，写下千古送别绝句《赠汪伦》。',
  'zeng_wang_lun',
  '[]'::jsonb,
  '{"freedom":20,"sorrow":10}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"li_bai_crisis_anshi_755"}'::jsonb,
  10
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'li_bai_crisis_anshi_755',
  'li_bai',
  755,
  'lu_shan',
  '渔阳鼙鼓 · 安史之乱爆发',
  'crisis_response',
  '天宝十四载十一月，安禄山起兵十五万叛乱，渔阳鼙鼓动地来，两京沦陷，大唐盛世戛然而止！李白携妻南奔避难庐山。',
  '天宝十四载十一月，安禄山起兵十五万叛乱，渔阳鼙鼓动地来，两京沦陷，大唐盛世戛然而止！李白携妻南奔避难庐山。',
  NULL,
  '[]'::jsonb,
  '{"anger":40,"sorrow":35,"freedom":-25}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"li_bai_xunyang_prison_757"}'::jsonb,
  11
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'li_bai_xunyang_prison_757',
  'li_bai',
  757,
  'xunyang',
  '浔阳系狱 · 长流夜郎',
  'exile',
  '永王璘兵败，五十七岁的李白以附逆罪系狱浔阳，命悬一线。幸得宋若思、郭子仪等力保免死，改判长流夜郎，万里投荒。',
  '永王璘兵败，五十七岁的李白以附逆罪系狱浔阳，命悬一线。幸得宋若思、郭子仪等力保免死，改判长流夜郎，万里投荒。',
  NULL,
  '[]'::jsonb,
  '{"sorrow":45,"anger":30,"freedom":-30}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"li_bai_baidicheng_759"}'::jsonb,
  12
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'li_bai_baidicheng_759',
  'li_bai',
  759,
  'baidicheng',
  '白帝城闻赦',
  'travel',
  '流放夜郎途中行至夔州白帝城，忽闻朝廷大赦天下！劫后余生的李白狂喜过望，随即登舟东下江陵，千里一日还！',
  '流放夜郎途中行至夔州白帝城，忽闻朝廷大赦天下！劫后余生的李白狂喜过望，随即登舟东下江陵，千里一日还！',
  'zao_fa_bai_di_cheng',
  '[]'::jsonb,
  '{"freedom":45,"passion":35,"sorrow":-35}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"li_bai_dangtu_762"}'::jsonb,
  13
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'li_bai_dangtu_762',
  'li_bai',
  762,
  'jingxian',
  '骑鲸捉月 · 诗仙谢幕',
  'passing',
  '宝应元年冬，六十二岁的李白病卒于当涂，留绝笔《临终歌》托付李阳冰。民间传其醉后江上捉月，骑鲸飞升，盛唐绝代诗仙魂归星汉！',
  '宝应元年冬，六十二岁的李白病卒于当涂，留绝笔《临终歌》托付李阳冰。民间传其醉后江上捉月，骑鲸飞升，盛唐绝代诗仙魂归星汉！',
  NULL,
  '[]'::jsonb,
  '{"freedom":50,"sorrow":10,"passion":20}'::jsonb,
  '{}'::jsonb,
  '{"triggers_retrospective":{"passing_year":762,"passing_location_name":"当涂（今安徽马鞍山当涂县）","epitaph_title":"盛唐绝代谪仙 · 一生行状通鉴","swan_song_title":"《临终歌》（李太白绝笔）","swan_song_lines":["大鹏飞兮振八裔，中天摧兮力不济。","馀风激兮万世，游扶桑兮挂石袂。","后人得之传此，仲尼亡兮谁为出涕！"],"departure_narrative":"唐代宗宝应元年（公元 762 年）深冬，六十二岁的李白卧病安徽当涂。回首这一生：仗剑去蜀、名动京华、供奉翰林、赐金放还、颍阳豪饮、安史避难、误入王幕、系狱浔阳、流放夜郎、白帝闻赦……大起大落，人间如寄。临终前，李白将平生诗文草稿数万言，郑重托付给当时任当涂县令的族叔、大书法家李阳冰，叹道：“大鹏飞兮振八裔，中天摧兮力不济！”遂溘然长逝。民间更愿相信诗仙未曾死去——在一个江风微寒的月圆之夜，太白痛饮千钟，纵身江中捉月，骑跨巨鲸直上青天九霄，羽化成仙而去。","lifetime_summary":"李白（701年—762年），字太白，号青莲居士。中国历史上最伟大的浪漫主义宗匠，世尊“诗仙”。他的一生跨越盛唐由开元天宝极盛到安史之乱巨变的完整历史波澜。他以无与伦比的天才想象、横绝天汉的雄奇气魄，为华夏文明铸造了最瑰丽璀璨的诗歌皇冠。","master_appraisals":[{"critic":"杜甫","relationship":"同代诗圣 · 毕生挚友","quote":"笔落惊风雨，诗成泣鬼神。敏捷诗千帖，飘零酒一杯。","comment":"杜甫一生对李白推崇备至，称其诗文如狂飙骤雨撼动天地，晚年更在《不见》中痛呼：“世人皆欲杀，吾意独怜才！”千古双星相惜，感天动地。"},{"critic":"贺知章","relationship":"盛唐诗狂 · 长安伯乐","quote":"子，谪仙人也！解金龟换酒，与尔同销万古愁。","comment":"天宝初年，官居三品的贺知章在长安紫极宫读罢《蜀道难》，惊呼李白乃九天谪落凡尘之仙客，遂解下御赐金龟换酒痛饮，奠定“诗仙”万世美名。"},{"critic":"苏轼（东坡）","relationship":"北宋文宗 · 跨代知音","quote":"李太白、杜子美，二子者出，而魏晋六朝之作始为小矣。","comment":"苏东坡评赞李白诗如天马行空、不可羁勒，彻底冲破了前代齐梁浮靡绮丽之习，神骨凌虚，独步万古。"},{"critic":"严羽《沧浪诗话》","relationship":"宋代诗论泰斗","quote":"太白不能为子美之沉郁，子美不能为太白之飘逸。","comment":"严羽将李白定为中国诗歌“飘逸神品”之极诣，其诗全无斧凿痕迹，浑然天成，如羚羊挂角，无迹可求。"},{"critic":"韩愈","relationship":"唐代古文运动领袖","quote":"李杜文章在，光焰万丈长。不知群儿愚，那用故谤伤！","comment":"韩愈力斥后世对李白的微词非议，断定李太白之文章如日月经天、江河行地，其万丈光芒任凭千秋万代亦不可磨灭。"}],"historical_legacy":"【盛唐气象的至高具象】：李白不仅是一位诗人，他更是盛唐盛世自由、自信、雄奇与浪漫精神的灵魂化身；\n\n【三家融汇的绝代人格】：他将儒家的济苍生抱负、道家的仙风傲骨、墨侠的仗剑任气融于一身，成就千古绝伦之生命范式；\n\n【傲骨凌霜，虽屈不移】：任凭赐金放还、系狱流放，始终傲骨凌然，“安能摧眉折腰事权贵，使我不得开心颜”成为千古士人风骨的不朽标杆；\n\n【辞赋光焰，万古垂青】：诗仙虽逝，其千峰飞瀑、月夜孤舟、将进狂歌、梦游仙山，永远流淌在华夏民族的精神血脉之中。"}}'::jsonb,
  14
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'du_fu_youth_736',
  'du_fu',
  736,
  'taishan',
  '齐赵壮游 · 登泰山《望岳》',
  'travel',
  '二十四岁的杜甫应举落第后，胸怀壮志漫游齐赵。登临东岳泰山绝顶，见天地造化，豪气干云，挥笔写下“会当凌绝顶，一览众山小”！',
  '二十四岁的杜甫应举落第后，胸怀壮志漫游齐赵。登临东岳泰山绝顶，见天地造化，豪气干云，挥笔写下“会当凌绝顶，一览众山小”！',
  'wang_yue',
  '[]'::jsonb,
  '{"passion":35,"freedom":25}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"du_fu_luoyang_meeting_744"}'::jsonb,
  1
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'du_fu_luoyang_meeting_744',
  'du_fu',
  744,
  'luoyang',
  '洛阳初会 · 诗坛双星相遇',
  'meeting',
  '天宝三载，三十三岁的杜甫在洛阳与刚被唐玄宗“赐金放还”的李白相逢。两人一见如故，携手同游梁宋、把酒论诗，成为中国文学史上最璀璨的双星交汇。',
  '天宝三载，三十三岁的杜甫在洛阳与刚被唐玄宗“赐金放还”的李白相逢。两人一见如故，携手同游梁宋、把酒论诗，成为中国文学史上最璀璨的双星交汇。',
  NULL,
  '[]'::jsonb,
  '{"freedom":30,"passion":25}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"du_fu_changan_struggle_751"}'::jsonb,
  2
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'du_fu_changan_struggle_751',
  'du_fu',
  751,
  'chang_an',
  '困守长安 · 忧思国步艰危',
  'travel',
  '天宝年间，杜甫客居长安长达十年，求官不第，目睹李林甫奸相弄权与权贵奢靡。“朝扣富儿门，暮随肥马尘”，写下《兵车行》《丽人行》，文心转向现实苍生。',
  '天宝年间，杜甫客居长安长达十年，求官不第，目睹李林甫奸相弄权与权贵奢靡。“朝扣富儿门，暮随肥马尘”，写下《兵车行》《丽人行》，文心转向现实苍生。',
  NULL,
  '[]'::jsonb,
  '{"sorrow":30,"anger":25,"passion":-10}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"du_fu_an_shi_crisis_755"}'::jsonb,
  3
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'du_fu_an_shi_crisis_755',
  'du_fu',
  755,
  'chang_an',
  '安史大乱 · 陷贼长安《春望》',
  'crisis_response',
  '天宝十四载冬，安史之乱爆发，潼关失守，两京沦陷。杜甫北上奔赴行在途中被叛军俘获押回长安，面对沦陷国都，血泪写就《春望》与《哀江头》！',
  '天宝十四载冬，安史之乱爆发，潼关失守，两京沦陷。杜甫北上奔赴行在途中被叛军俘获押回长安，面对沦陷国都，血泪写就《春望》与《哀江头》！',
  'chun_wang',
  '[]'::jsonb,
  '{"sorrow":40,"anger":30,"homesickness":35}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"du_fu_fengxiang_choice_757"}'::jsonb,
  4
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'du_fu_fengxiang_choice_757',
  'du_fu',
  757,
  'chang_an',
  '冒死奔凤翔 · 拾遗进谏抉择',
  'choice',
  '至德二年四月，杜甫冒死穿过敌防线潜逃至凤翔行在，获授左拾遗。因宰相房琯兵败获罪，杜甫面临是否犯颜直谏的生死抉择。',
  '至德二年四月，杜甫冒死穿过敌防线潜逃至凤翔行在，获授左拾遗。因宰相房琯兵败获罪，杜甫面临是否犯颜直谏的生死抉择。',
  NULL,
  '[{"id":"choice_757_shiyi","event_id":"du_fu_fengxiang_choice_757","prompt":"凤翔行在，宰相房琯因用春秋古法车战大败于叛军，肃宗震怒欲严惩除名。满朝文武噤若寒蝉。身为官职微卑的左拾遗，你是否冒死上疏营救？","historical_context":"历史上杜甫认为房琯是忠直之臣，有大臣器量，虽犯战略失误但不至治重罪。杜甫冒死上疏力争，触怒肃宗被敕命下狱审讯，幸得宰相张镐等极力营救才获免，旋即被贬为华州司功参军。这一抉择展现了杜甫宁折不弯的直谏骨气。","options":[{"id":"opt_shiyi_speak_up","text":"直言力谏，虽千万人吾往矣（历史正史）","mood_delta":{"freedom":25,"passion":30,"sorrow":10},"unlocks_poems":["chun_wang"],"unlocks_locations":["chang_an"],"is_historical":true,"historical_note":"杜甫选择了冒死上章谏救房琯。虽因此触怒龙颜险遭诛杀、终生仕途尽毁，却以一介布衣铮铮铁骨，践行了古代诤臣言官以死报国的崇高操守。"},{"id":"opt_shiyi_silent","text":"明哲保身，曲意求全（平行历史）","mood_delta":{"freedom":-20,"sorrow":35,"anger":-15},"unlocks_poems":[],"unlocks_locations":["chang_an"],"is_historical":false,"historical_note":"若杜甫在此保持沉默，或许能顺遂升迁为朝中高官，免去半生颠沛之苦；然而世间却将永远失去一位敢于直面苦难、与苍生同呼吸的纯粹诗圣。"}]}]'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"du_fu_chengdu_thatched_760"}'::jsonb,
  5
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'du_fu_chengdu_thatched_760',
  'du_fu',
  760,
  'chengdu',
  '入蜀定居 · 谒武侯祠《蜀相》',
  'travel',
  '乾元二年底，杜甫弃官携家颠沛流离入蜀，在成都西郊浣花溪畔营建草堂。安定初定，杜甫前往城外武侯祠凭吊诸葛孔明，写下名绝千古的七律《蜀相》。',
  '乾元二年底，杜甫弃官携家颠沛流离入蜀，在成都西郊浣花溪畔营建草堂。安定初定，杜甫前往城外武侯祠凭吊诸葛孔明，写下名绝千古的七律《蜀相》。',
  'shu_xiang',
  '[]'::jsonb,
  '{"freedom":25,"sorrow":10}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"du_fu_chengdu_autumn_wind_761"}'::jsonb,
  6
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'du_fu_chengdu_autumn_wind_761',
  'du_fu',
  761,
  'chengdu',
  '浣花溪草堂 · 庇佑天下寒士',
  'travel',
  '上元二年，杜甫在成都草堂躬耕。春夜细雨催生万木，赋《春夜喜雨》；八月秋风怒号卷破茅屋，杜甫长夜难眠，发出“安得广厦千万间，大庇天下寒士俱欢颜”的至圣悲悯！',
  '上元二年，杜甫在成都草堂躬耕。春夜细雨催生万木，赋《春夜喜雨》；八月秋风怒号卷破茅屋，杜甫长夜难眠，发出“安得广厦千万间，大庇天下寒士俱欢颜”的至圣悲悯！',
  'mao_wu_wei_qiu_feng_suo_po_ge',
  '[]'::jsonb,
  '{"passion":35,"sorrow":25,"freedom":20}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"du_fu_rejoice_recovery_763"}'::jsonb,
  7
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'du_fu_rejoice_recovery_763',
  'du_fu',
  763,
  'chengdu',
  '平生第一快诗 · 收复蓟北',
  'travel',
  '宝应二年春，史朝义自缢，安史之乱历经八年彻底平定！杜甫在梓州闻听收复河南河北大捷，喜极而泣，挥毫写下平生最痛快的绝唱《闻官军收河南河北》！',
  '宝应二年春，史朝义自缢，安史之乱历经八年彻底平定！杜甫在梓州闻听收复河南河北大捷，喜极而泣，挥毫写下平生最痛快的绝唱《闻官军收河南河北》！',
  'wen_guan_jun_shou_he_nan_he_bei',
  '[]'::jsonb,
  '{"passion":50,"freedom":40,"sorrow":-30}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"du_fu_kuizhou_denggao_767"}'::jsonb,
  8
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'du_fu_kuizhou_denggao_767',
  'du_fu',
  767,
  'baidicheng',
  '夔州登高 · 登峰造极《登高》',
  'travel',
  '大历二年重阳，多病衰老的杜甫羁留夔州白帝城。独自登临江头高台，面对无边落木与滔滔长江，融八重悲怆于十四字中，写就千古七律冠冕《登高》。',
  '大历二年重阳，多病衰老的杜甫羁留夔州白帝城。独自登临江头高台，面对无边落木与滔滔长江，融八重悲怆于十四字中，写就千古七律冠冕《登高》。',
  'deng_gao',
  '[]'::jsonb,
  '{"sorrow":45,"passion":20}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"du_fu_xiangjiang_passing_770"}'::jsonb,
  9
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'du_fu_xiangjiang_passing_770',
  'du_fu',
  770,
  'xiangjiang',
  '湘江扁舟 · 诗圣谢幕',
  'passing',
  '大历五年深冬，五十九岁的杜甫在由潭州往岳阳的湘江小舟上病逝。一代诗圣以天地一沙鸥之孤傲，在颠沛与悲悯中走完了波澜壮阔的一生，诗史光芒永耀千秋！',
  '大历五年深冬，五十九岁的杜甫在由潭州往岳阳的湘江小舟上病逝。一代诗圣以天地一沙鸥之孤傲，在颠沛与悲悯中走完了波澜壮阔的一生，诗史光芒永耀千秋！',
  'lv_ye_shu_huai',
  '[]'::jsonb,
  '{"sorrow":20,"freedom":40,"passion":20}'::jsonb,
  '{}'::jsonb,
  '{"triggers_retrospective":{"passing_year":770,"passing_location_name":"湘江（湖南岳阳/平江）","epitaph_title":"大唐千古诗圣 · 少陵野老一生行状通鉴","swan_song_title":"《旅夜书怀》（少陵绝唱）","swan_song_lines":["细草微风岸，危樯独夜舟。","星垂平野阔，月涌大江流。","名岂文章著，官应老病休。","飘飘何所似，天地一沙鸥。"],"departure_narrative":"唐代宗大历五年（公元 770 年）深冬，五十九岁的杜甫拖着中风、肺疾缠身的病骨，携带着全家泛舟漂泊在冰冷的湘江之上。从巩县出世、齐赵壮游、困顿长安、安史陷贼、草堂避难、再到夔州登高，这位将大唐整个时代的沧桑巨变与黎民饥寒深深铭刻在血泪诗篇里的伟人，在连绵阴雨与贫寒病痛中，合上了疲惫的双目。临终前，他留下了《风疾舟中伏枕书怀三十六韵》：“战血流依旧，军声动至今。凄凉宝剑篇，羁旅白头吟。”一代诗圣，在潇湘风涛里悄然谢幕，长眠于天地江山之间。","lifetime_summary":"杜甫（712年—770年），字子美，自号少陵野老，后世尊称“诗圣”。他的诗作不仅达到了中国古典格律诗的至高极诣，更以至大至深的同情心、正义感与家国担当，全面而深刻地反映了唐帝国由开元盛世急转为安史之乱浩劫的历史全貌，被千古公推为“诗史”。","master_appraisals":[{"critic":"苏轼（东坡）","relationship":"北宋文宗 · 跨代崇仰","quote":"古今诗人多矣，至杜子美而集大成。","comment":"苏东坡在《王定国诗集序》中尊杜甫为古往今来集大成者，其诗一洗前代浮华轻艳之态，气象深沉博大，前无古人，后无来者。"},{"critic":"元稹","relationship":"中唐元白诗派领袖","quote":"诗人以来，未有如子美者矣！","comment":"元稹在《唐故检校工部员外郎杜君墓系铭》中极赞杜甫：“尽得古今之体势，兼人人之所独专。”首次将杜甫推举到凌驾历代文人的无上至尊地位。"},{"critic":"黄庭坚（山谷）","relationship":"宋代江西诗派宗祖","quote":"杜之诗法，如灵丹一粒，点铁成金。","comment":"黄庭坚极力推崇杜甫的法度格律与造语锤炼，认为杜诗“无一字无来处”，开创了宋代尊杜学杜的时代大潮。"},{"critic":"严羽《沧浪诗话》","relationship":"南宋诗论泰斗","quote":"子美不能为太白之飘逸，太白不能为子美之沉郁。","comment":"严羽将杜甫定为中国古典诗歌“沉郁顿挫”的绝对顶峰，其诗骨力雄健，忧思深刻，为现实主义文学立下了万古不易之准绳。"},{"critic":"韩愈","relationship":"唐代文坛领袖","quote":"李杜文章在，光焰万丈长。不知群儿愚，那用故谤伤！","comment":"韩愈坚定地将杜甫与李白并列为中华诗坛双子星，断定两人的文章如同日月当空，任何诋毁非议都无法减损其万丈光辉。"}],"historical_legacy":"【集大成的万世诗圣】：杜甫将中国古典五律、七律、五言古诗推向了空前绝后的法度巅峰，“千古七律第一”名冠史册；\n\n【惊天地泣鬼神的“诗史”】：以《三吏》《三别》《春望》忠实记录民间疾苦与时代风云，成为历史最忠诚、最深情的见证人；\n\n【致君尧舜上、再使风俗淳的儒者典范】：终其一生未忘兼济天下，“安得广厦千万间，大庇天下寒士俱欢颜”成为华夏知识分子最高道德情怀的图腾；\n\n【杜诗风骨代代相传】：自中唐以降，白居易、韩愈、苏轼、黄庭坚、陆游、辛弃疾等历代文豪无不奉杜甫为精神导师，其诗魂早已融入中华民族忧国忧民、自强不息的血脉之中。"}}'::jsonb,
  10
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'su_shi_youth_meizhou',
  'su_shi',
  1057,
  'sichuan',
  '眉山出蜀',
  'travel',
  '二十二岁苏轼与弟苏辙进京应举，欧阳修读其卷大为惊叹：“老夫当避路，放他出一头地也！”',
  '二十二岁苏轼与弟苏辙进京应举，欧阳修读其卷大为惊叹：“老夫当避路，放他出一头地也！”',
  NULL,
  '[]'::jsonb,
  '{"passion":35,"freedom":25}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"su_shi_hangzhou_1074"}'::jsonb,
  1
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'su_shi_hangzhou_1074',
  'su_shi',
  1074,
  'hangzhou',
  '西湖水光',
  'appointment',
  '通判杭州，巡察江堤，留连西湖山水，写下“欲把西湖比西子，淡妆浓抹总相宜”。',
  '通判杭州，巡察江堤，留连西湖山水，写下“欲把西湖比西子，淡妆浓抹总相宜”。',
  'shui_diao_ge_tou',
  '[]'::jsonb,
  '{"freedom":30,"passion":20}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"su_shi_wutai_crisis_1079"}'::jsonb,
  2
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'su_shi_wutai_crisis_1079',
  'su_shi',
  1079,
  'huangzhou',
  '乌台诗案抉择',
  'choice',
  '御史台台吏搜检苏轼诗文罗织罪名，逮捕入狱。面对生死险境，是委曲求全还是坚守文心？',
  '御史台台吏搜检苏轼诗文罗织罪名，逮捕入狱。面对生死险境，是委曲求全还是坚守文心？',
  NULL,
  '[{"id":"choice_1079_wutai","event_id":"su_shi_wutai_crisis_1079","prompt":"乌台大狱，九死一生。狱卒逼供，朝野震荡。你将如何安放自己这颗赤子之心？","historical_context":"历史上王安石、曹太后等多人力保，苏轼被贬黄州。这场大难彻底摧毁了苏轼的功名执念，却淬炼出一个千古不朽的“苏东坡”。","options":[{"id":"opt_wutai_accept","text":"直面贬谪，躬耕东坡（历史正史）","mood_delta":{"freedom":35,"sorrow":-20,"passion":15},"unlocks_poems":["ding_feng_bo"],"unlocks_locations":["huangzhou"],"is_historical":true,"historical_note":"苏轼选择了坦然接受命运的流放。在黄州赤壁之下，一个原本可能普通的北宋名臣，终于涅槃成为中国文学史的参天巨人东坡居士。"},{"id":"opt_wutai_withdraw","text":"万念俱灰，归隐田园（平行历史）","mood_delta":{"freedom":20,"homesickness":30,"passion":-20},"unlocks_poems":["gui_yuan_tian_ju_ci"],"unlocks_locations":["sichuan"],"is_historical":false,"historical_note":"若苏轼彻底心灰意冷隐遁林泉，或许能得享山野终老之安宁，世间却将永远失去《前赤壁赋》与《念奴娇·赤壁怀古》。"}]}]'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"su_shi_huangzhou_1082"}'::jsonb,
  3
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'su_shi_huangzhou_1082',
  'su_shi',
  1082,
  'huangzhou',
  '东坡雪堂 · 佛印赤壁相悟',
  'meeting',
  '贬谪黄州团练副使，躬耕东坡荒地，与佛印禅师泛舟赤壁之下，谈禅论道，豁达超然。',
  '贬谪黄州团练副使，躬耕东坡荒地，与佛印禅师泛舟赤壁之下，谈禅论道，豁达超然。',
  'ding_feng_bo',
  '[]'::jsonb,
  '{"freedom":40,"sorrow":-25}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"su_shi_changzhou_passing_1101"}'::jsonb,
  4
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'su_shi_changzhou_passing_1101',
  'su_shi',
  1101,
  'hangzhou',
  '常州谢幕 · 问汝平生功业',
  'passing',
  '建中靖国元年七月，六十六岁的苏轼自海南儋州北归，病逝于江苏常州。临终笑对生死，平生历尽黄州、惠州、儋州九死一生，浩然超脱，羽化仙逝！',
  '建中靖国元年七月，六十六岁的苏轼自海南儋州北归，病逝于江苏常州。临终笑对生死，平生历尽黄州、惠州、儋州九死一生，浩然超脱，羽化仙逝！',
  NULL,
  '[]'::jsonb,
  '{"freedom":50,"passion":20}'::jsonb,
  '{}'::jsonb,
  '{"triggers_retrospective":{"passing_year":1101,"passing_location_name":"常州（江苏常州孙氏馆）","epitaph_title":"北宋绝代文宗 · 东坡居士一生行状通鉴","swan_song_title":"《自题金山画像》（坡仙绝笔）","swan_song_lines":["心似已灰之木，身如不系之舟。","问汝平生功业，黄州惠州儋州。"],"departure_narrative":"宋徽宗建中靖国元年（公元 1101 年）七月二十八日，六十六岁的苏东坡在常州寓所平静走向生命的终点。病榻前，好友维琳方丈对他耳语：“端明宜勿忘西方（极乐世界）！”东坡笑答：“西方即不无，但个里着力不得。”门人钱济明问：“后事如何？”东坡坦然道：“着力即差。”遂溘然而逝。从眉山出蜀名动京华，到乌江大狱九死一生，再到躬耕东坡、贬谪岭南、跨海儋州，这位历尽三朝风雨的天才文宗，将一生的挫折与苦难全化作了人间的至味清欢与无边旷达。","lifetime_summary":"苏轼（1037年—1101年），字子瞻，号东坡居士。北宋中期文坛领袖，“唐宋八大家”之一，豪放词派开创宗师。诗、词、文、书、画皆臻神品，是中国历史上少有的全才通才，其随遇而安、乐观超脱的人生态度，成为华夏士大夫最温润可亲的精神港湾。","master_appraisals":[{"critic":"黄庭坚（山谷）","relationship":"苏门四学士之首 · 挚友","quote":"苏东坡天才卓绝，迈往凌云，人莫能测。","comment":"黄庭坚深知东坡为人，赞其文章如江河破浪、天马行空，而其为人更是一片赤子之心，光明磊落如青天白日。"},{"critic":"陆游（放翁）","relationship":"南宋爱国诗翁","quote":"世间唯有东坡叟，天地无私一幅春。","comment":"陆游尊奉东坡为平生楷模，称其胸次浩然，即使处身蛮荒瘴疠之地，亦能将春天般的温暖与旷达洒向人间。"},{"critic":"王国维《人间词话》","relationship":"近代美学大师","quote":"东坡之词旷，稼轩之词豪。东坡以性情入词，开千古豪放新天地！","comment":"王国维评断苏轼将宋词从五代以来的花间脂粉之狭窄天地中彻底解放出来，“无意不可入，无事不可言”，气象横绝千秋。"},{"critic":"晁补之","relationship":"苏门四学士","quote":"东坡词，如天风海雨，回不可遏；又如挟天子以令诸侯，令人敛衽！","comment":"晁补之盛赞苏轼词的磅礴气魄与音乐韵律，认为其词作一旦吟诵，便如狂飙卷席，令同时代所有词家尽皆折服。"},{"critic":"朱熹","relationship":"南宋理学巨擘","quote":"自三代以下，文章绝伦，唯公一人而已。","comment":"即使在学术理路与苏轼政见不同的朱熹，亦赞叹苏东坡文才天纵，汪洋恣肆，为三代之后文坛罕逢敌手之巨匠。"}],"historical_legacy":"【开宗立派的豪放词宗】：打破了“词为艳科”的千年成见，开拓出“大江东去浪淘尽”、“一蓑烟雨任平生”的万千壮阔气象；\n\n【随遇而安的生活哲学大成】：在流放中发现美食（东坡肉）、治理西湖（苏堤春晓）、劝导农桑，把苦难活成了诗意的盛宴；\n\n【百科全书式的文艺通才】：书法列“宋四家”之冠（《黄州寒食帖》天下一绝），开创文人写意枯木竹石画派；\n\n【中国人心灵的永远避风港】：“问汝平生功业，黄州惠州儋州”，苏东坡用一生的豁达教会了中国人如何在逆境中与命运温柔和解。"}}'::jsonb,
  5
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'lqz_youth_1100',
  'li_qingzhao',
  1100,
  'jinan',
  '泉城胜地 · 溪亭沉醉《如梦令》',
  'travel',
  '十六七岁的李清照生活在齐州泉城，名门闺秀，天资超绝。夏日郊游溪亭泛舟，薄醉迷途，误入藕花深处惊起一滩鸥鹭，挥就名动京华的《如梦令》。',
  '十六七岁的李清照生活在齐州泉城，名门闺秀，天资超绝。夏日郊游溪亭泛舟，薄醉迷途，误入藕花深处惊起一滩鸥鹭，挥就名动京华的《如梦令》。',
  'ru_meng_ling_xi_ting',
  '[]'::jsonb,
  '{"freedom":35,"passion":25}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"lqz_marriage_kaifeng_1101"}'::jsonb,
  1
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'lqz_marriage_kaifeng_1101',
  'li_qingzhao',
  1101,
  'kaifeng',
  '汴京结缡 · 赌书泼茶金石缘',
  'meeting',
  '十八岁李清照在东京汴梁与太学生赵明诚成婚。夫妻志趣高雅，省衣节食搜求商周鼎彝与汉魏碑刻，相濡以沫，“赌书消得泼茶香”，传为文坛千古佳话。',
  '十八岁李清照在东京汴梁与太学生赵明诚成婚。夫妻志趣高雅，省衣节食搜求商周鼎彝与汉魏碑刻，相濡以沫，“赌书消得泼茶香”，传为文坛千古佳话。',
  NULL,
  '[]'::jsonb,
  '{"freedom":30,"passion":30}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"lqz_kaifeng_yijianmei_1104"}'::jsonb,
  2
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'lqz_kaifeng_yijianmei_1104',
  'li_qingzhao',
  1104,
  'kaifeng',
  '深闺相思 · 才下眉头《一剪梅》',
  'appointment',
  '赵明诚远行游学，青年少妇独守汴京深闺。清秋冷月，泛舟思君，写下“红藕香残玉簟秋”、“一种相思，两处闲愁。才下眉头，却上心头”的绝美词章。',
  '赵明诚远行游学，青年少妇独守汴京深闺。清秋冷月，泛舟思君，写下“红藕香残玉簟秋”、“一种相思，两处闲愁。才下眉头，却上心头”的绝美词章。',
  'yi_jian_mei',
  '[]'::jsonb,
  '{"homesickness":35,"sorrow":20}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"lqz_jingkang_crisis_1127"}'::jsonb,
  3
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'lqz_jingkang_crisis_1127',
  'li_qingzhao',
  1127,
  'kaifeng',
  '靖康浩劫 · 北宋覆亡大南渡',
  'crisis_response',
  '靖康二年春，金兵长驱南下攻陷汴梁，俘虏徽钦二帝及后妃皇族北狩，北宋轰然倾覆！李清照独自押运十五车累朝金石古籍书画，涉水渡淮，仓皇奔逃江南。',
  '靖康二年春，金兵长驱南下攻陷汴梁，俘虏徽钦二帝及后妃皇族北狩，北宋轰然倾覆！李清照独自押运十五车累朝金石古籍书画，涉水渡淮，仓皇奔逃江南。',
  NULL,
  '[]'::jsonb,
  '{"sorrow":50,"anger":40,"homesickness":45}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"lqz_jiangning_choice_1129"}'::jsonb,
  4
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'lqz_jiangning_choice_1129',
  'li_qingzhao',
  1129,
  'jiankang',
  '江宁之变 · 乌江思项羽抉择',
  'choice',
  '建炎三年春，赵明诚任江宁知府，城中发生兵变，赵明诚竟弃城夜缒逃遁。李清照深感奇耻大辱。途经乌江项羽自刎处，面对丈夫的懦弱与朝廷的苟安，何以自处？',
  '建炎三年春，赵明诚任江宁知府，城中发生兵变，赵明诚竟弃城夜缒逃遁。李清照深感奇耻大辱。途经乌江项羽自刎处，面对丈夫的懦弱与朝廷的苟安，何以自处？',
  NULL,
  '[{"id":"choice_1129_jiangning","event_id":"lqz_jiangning_choice_1129","prompt":"建炎三年江宁兵变，身为一府长官的丈夫赵明诚畏罪缒城弃职私逃，导致满城混乱。面对丈夫的软弱自私与朝廷的偏安苟活，你将如何表达自己的风骨？","historical_context":"历史上李清照对赵明诚弃城潜逃极为鄙视与痛心。五月乘船顺流而下经乌江项羽自刎处，李清照直视丈夫，悲愤题下《夏日绝句》：“生当作人杰，死亦为鬼雄。至今思项羽，不肯过江东！”赵明诚闻之愧悔交加，不久郁悒成疾而卒。","options":[{"id":"opt_jiangning_condemn","text":"借项羽讽刺苟安，题《夏日绝句》（历史正史）","mood_delta":{"freedom":30,"passion":35,"anger":20},"unlocks_poems":["xia_ri_jue_ju"],"unlocks_locations":["jiankang"],"is_historical":true,"historical_note":"李清照选择了毫不妥协的直面与批判。这首《夏日绝句》不仅令丈夫赵明诚羞愧无地，更像一柄利剑刺向南渡偏安、苟且偷生的满朝群臣，铸就千古不灭的凛凛铁骨！"},{"id":"opt_jiangning_compromise","text":"顾全夫妻颜面，隐忍不发（平行历史）","mood_delta":{"freedom":-25,"sorrow":30,"anger":-10},"unlocks_poems":[],"unlocks_locations":["jiankang"],"is_historical":false,"historical_note":"若李清照选择隐忍吞声，虽可维系表面夫妻和睦，世间却将永远失去这首字字千钧、令无数须眉男儿汗颜的千古正气绝唱。"}]}]'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"lqz_sea_escape_1130"}'::jsonb,
  5
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'lqz_sea_escape_1130',
  'li_qingzhao',
  1130,
  'hangzhou',
  '海天云涛 · 豪迈浪漫《渔家傲》',
  'travel',
  '建炎四年金兵步步紧逼，宋高宗逃亡海上，李清照亦随难民船队漂泊浙东大洋。面对海天无际翻涌云涛，梦入天宫，写下“九万里风鹏正举。风休住，蓬舟吹取三山去”的旷世豪迈词！',
  '建炎四年金兵步步紧逼，宋高宗逃亡海上，李清照亦随难民船队漂泊浙东大洋。面对海天无际翻涌云涛，梦入天宫，写下“九万里风鹏正举。风休住，蓬舟吹取三山去”的旷世豪迈词！',
  'yu_jia_ao_tian_jie',
  '[]'::jsonb,
  '{"freedom":45,"passion":35}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"lqz_shengshengman_1134"}'::jsonb,
  6
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'lqz_shengshengman_1134',
  'li_qingzhao',
  1134,
  'hangzhou',
  '避乱浙东 · 千古绝唱《声声慢》',
  'travel',
  '绍兴四年，赵明诚病卒数年，半生金石散佚殆尽，李清照孑然一身寓居江南客舍。秋雨黄昏，连用十四叠字，写尽千古第一愁绝之作《声声慢·寻寻觅觅》。',
  '绍兴四年，赵明诚病卒数年，半生金石散佚殆尽，李清照孑然一身寓居江南客舍。秋雨黄昏，连用十四叠字，写尽千古第一愁绝之作《声声慢·寻寻觅觅》。',
  'sheng_sheng_man',
  '[]'::jsonb,
  '{"sorrow":55,"homesickness":40}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"lqz_wulingchun_1135"}'::jsonb,
  7
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'lqz_wulingchun_1135',
  'li_qingzhao',
  1135,
  'hangzhou',
  '双溪舴艋 · 载不动愁《武陵春》',
  'travel',
  '绍兴五年春，避乱金华的李清照暮春伤怀。“物是人非事事休，欲语泪先流”，面对双溪轻舟，奇绝写下“只恐双溪舴艋舟，载不动许多愁”，化虚为实，登峰造极。',
  '绍兴五年春，避乱金华的李清照暮春伤怀。“物是人非事事休，欲语泪先流”，面对双溪轻舟，奇绝写下“只恐双溪舴艋舟，载不动许多愁”，化虚为实，登峰造极。',
  'wu_ling_chun',
  '[]'::jsonb,
  '{"sorrow":30,"freedom":15}'::jsonb,
  '{}'::jsonb,
  '{"next_event_id":"lqz_linan_passing_1155"}'::jsonb,
  8
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  'lqz_linan_passing_1155',
  'li_qingzhao',
  1155,
  'hangzhou',
  '临安雨歇 · 易安谢幕',
  'passing',
  '绍兴二十五年，七十二岁的李清照在南宋都城临安（今杭州）孤寂离世。千古第一才女完成了《金石录后序》，留下一卷锦绣长词，浩然谢幕，芳名永垂青史！',
  '绍兴二十五年，七十二岁的李清照在南宋都城临安（今杭州）孤寂离世。千古第一才女完成了《金石录后序》，留下一卷锦绣长词，浩然谢幕，芳名永垂青史！',
  NULL,
  '[]'::jsonb,
  '{"freedom":50,"sorrow":20,"passion":20}'::jsonb,
  '{}'::jsonb,
  '{"triggers_retrospective":{"passing_year":1155,"passing_location_name":"临安（浙江杭州）","epitaph_title":"宋代婉约词宗 · 易安居士一生行状通鉴","swan_song_title":"《金石录后序》（易安绝笔跋文）","swan_song_lines":["三十四年之间，忧患得失，何其备也！","物之成毁，有时数存焉。","曷足深动其心？是以区区记其始终，","亦为好尚者之戒云尔。"],"departure_narrative":"南宋高宗绍兴二十五年（公元 1155 年）深秋，七十二岁高龄的李清照在临安陋巷的小楼中静静闭上了双眼。回首平生：齐州胜景、溪亭沉醉、汴京结缡、赌书泼茶、靖康天倾、流亡江浙、乌江悲歌、双溪载愁……这位以女儿之躯傲立两宋文坛顶峰的奇女子，历尽了人生最繁华的极乐，也咽下了时代最残酷的彻骨悲凉。临终前，她整理完了与亡夫毕生心血凝聚的《金石录》，完成了荡气回肠的《金石录后序》，坦然超越了物欲得失。千古第一才女，从此化作华夏文学夜空中最清绝璀璨的文曲巨星。","lifetime_summary":"李清照（1084年—1155年），号易安居士。宋代婉约词派至高宗师，公认的中国文学史“千古第一才女”。她以卓越的艺术天才在宋词中自树一帜，早年词风清新秀丽、机敏活泼，晚年因国破家亡、身世坎坷，转而沉郁凄绝、慷慨悲壮，其词论更确立了“词别是一家”的文学法度。","master_appraisals":[{"critic":"王国维《人间词话》","relationship":"近代国学美学大师","quote":"词家多以儿女情长，易安则独有丈夫之气！","comment":"王国维盛赞李清照词格兼具极度的细腻与空前的豪健，“生当作人杰，死亦为鬼雄”气魄雄拔，宋代士大夫群臣皆愧不如。"},{"critic":"辛弃疾（稼轩）","relationship":"南宋豪放派词宗","quote":"易安人比黄花，而骨如金石。其词之妙，真鬼斧神工也。","comment":"同为济南老乡的辛弃疾对李清照推崇备至，其爱国词意与沉雄气骨深受易安晚年慷慨悲歌之深刻熏陶。"},{"critic":"王士禛（渔洋山人）","relationship":"清代一代诗宗","quote":"婉约以易安为宗，豪放以幼安为首，皆我济南之绝代奇才！","comment":"王士禛将李清照定为中国两千年婉约词派唯一的至高统领者，与辛弃疾并称为“济南二安”，双峰并峙。"},{"critic":"朱熹","relationship":"南宋理学集大成者","quote":"本朝妇人能文，唯魏夫人与李易安二人而已，而易安尤杰出。","comment":"即使是以严苛著称的理学大师朱熹，面对李清照横溢的才华与渊博的学识，亦不得不由衷赞叹其为两宋女性文学无可比拟的巅峰。"},{"critic":"梁启超","relationship":"近代思想家 · 学术宗师","quote":"易安身经丧乱，作词沉哀入骨，真天挺之杰也！","comment":"梁启超赞赏李清照在时代浩劫面前表现出的坚忍傲骨与民族气节，认为其五言绝句《夏日绝句》冠绝两宋三百年，令人肃然起敬。"}],"historical_legacy":"【两宋词坛的至高丰碑】：独创“易安体”，在长短句韵律、叠字技法（如《声声慢》十四叠字）、口语入词方面达至化境；\n\n【中国金石学的开拓宗师】：与赵明诚共同撰就三十卷《金石录》，不仅抢救了先秦两汉无数国宝重器，更以《金石录后序》成为中国传记文学千古奇文；\n\n【超越时代的女性独立风骨】：敢于面对封建礼教直斥男权懦弱，“生当作人杰，死亦为鬼雄”，为古代女性确立了独立自尊与家国大义的精神坐标；\n\n【民族苦难的深情吟唱者】：她的生命轨迹与北宋盛极转衰、南宋流亡偏安紧密相连，以柔弱之笔写下时代最沉痛的灵魂史诗。"}}'::jsonb,
  9
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;

-- 6. 山河风物信物
INSERT INTO artifacts (id, name, category, rarity, description, historical_story, icon, poet_exclusive_id, city_origin_id, buffs, metadata)
VALUES (
  'artifact_taibai_jian',
  '太白青锋宝剑',
  'weapon',
  'legendary',
  '李白十五岁学剑，二十五岁仗剑去国，辞亲远游。此剑寒芒如霜，见证了诗仙任侠尚义、凌厉超凡的少年壮志。',
  '《新唐书·李白传》：“喜纵横术，击剑，为任侠，轻财重施。” 裴旻剑舞、李白诗歌、张旭草书，世称盛唐“三绝”。',
  '⚔️',
  'li_bai',
  'sichuan',
  '{"pride":20,"inspiration":15}'::jsonb,
  '{"quote":"高冠佩雄剑，长揖独凌云。","obtainMethod":"诗仙李白初始随身家传信物","categoryName":"兵刃文玩","originCityName":"江油青莲"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  description = EXCLUDED.description,
  historical_story = EXCLUDED.historical_story,
  buffs = EXCLUDED.buffs,
  metadata = EXCLUDED.metadata;

INSERT INTO artifacts (id, name, category, rarity, description, historical_story, icon, poet_exclusive_id, city_origin_id, buffs, metadata)
VALUES (
  'artifact_jinling_chunjiu',
  '金陵春酒葫芦',
  'tea_wine',
  'epic',
  '吴姬压酒之肆，盛唐江东风华所凝。太白豪饮千钟、斗酒诗百篇，金陵春酒乃其醉眼看人间的无上灵感之源。',
  '李白《金陵酒肆留别》：“金陵子弟来相送，欲行不行各尽觞。请君试问东流水，别意与之谁短长。”',
  '🍶',
  'li_bai',
  'jiankang',
  '{"inspiration":15,"serenity":10}'::jsonb,
  '{"quote":"风吹柳花满店香，吴姬压酒劝客尝。金陵子弟来相送，欲行不行各尽觞。","obtainMethod":"游历至金陵或创作《将进酒》后领悟","categoryName":"佳酿香茗","originCityName":"金陵"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  description = EXCLUDED.description,
  historical_story = EXCLUDED.historical_story,
  buffs = EXCLUDED.buffs,
  metadata = EXCLUDED.metadata;

INSERT INTO artifacts (id, name, category, rarity, description, historical_story, icon, poet_exclusive_id, city_origin_id, buffs, metadata)
VALUES (
  'artifact_hanlin_baiguan',
  '翰林待诏白羽冠',
  'relic',
  'epic',
  '玄宗降辇步迎、以七宝床赐食，供奉翰林时所佩冠冕。它既承载着帝京之荣，亦见证了“天子呼来不上船”的孤傲风骨。',
  '杜甫《饮中八仙歌》：“李白一斗诗百篇，长安市上酒家眠。天子呼来不上船，自称臣是酒中仙。”',
  '🪶',
  'li_bai',
  'chang_an',
  '{"pride":15,"indignation":10}'::jsonb,
  '{"quote":"仰天大笑出门去，我辈岂是蓬蒿人！","obtainMethod":"亲历长安翰林供奉历史大事件","categoryName":"传家古物","originCityName":"长安"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  description = EXCLUDED.description,
  historical_story = EXCLUDED.historical_story,
  buffs = EXCLUDED.buffs,
  metadata = EXCLUDED.metadata;

INSERT INTO artifacts (id, name, category, rarity, description, historical_story, icon, poet_exclusive_id, city_origin_id, buffs, metadata)
VALUES (
  'artifact_caotang_li',
  '少陵野老草堂笠',
  'relic',
  'legendary',
  '浣花溪畔遮蔽急雨寒风之箬笠。纵使八月秋风卷走茅屋三重茅，草堂笠下的目光始终深情凝视着普天之下受冻的大地苍生。',
  '杜甫《茅屋为秋风所破歌》：“自经丧乱少睡眠，长夜沾湿何由彻！何时眼前突兀见此屋，吾庐独破受冻死亦足！”',
  '👒',
  'du_fu',
  'chengdu',
  '{"serenity":20,"melancholy":15}'::jsonb,
  '{"quote":"安得广厦千万间，大庇天下寒士俱欢颜！风雨不动安如山。","obtainMethod":"诗圣杜甫驻留成都浣花溪草堂时感悟","categoryName":"传家古物","originCityName":"成都草堂"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  description = EXCLUDED.description,
  historical_story = EXCLUDED.historical_story,
  buffs = EXCLUDED.buffs,
  metadata = EXCLUDED.metadata;

INSERT INTO artifacts (id, name, category, rarity, description, historical_story, icon, poet_exclusive_id, city_origin_id, buffs, metadata)
VALUES (
  'artifact_qizhao_gong',
  '齐赵角端良弓',
  'weapon',
  'epic',
  '少陵年轻时“放荡齐赵间，裘马颇清狂”之良弓。盛唐青年的英气与慷慨报国之志，尽在引弓待发那一瞬。',
  '杜甫《壮游》：“放荡齐赵间，裘马颇清狂。春歌丛台上，冬猎青丘旁。呼鹰皂枥林，扫迹黄豪冈。”',
  '🏹',
  'du_fu',
  'taishan',
  '{"pride":15,"inspiration":10}'::jsonb,
  '{"quote":"挽弓当挽强，用箭当用长。射人先射马，擒贼先擒王。","obtainMethod":"诗圣杜甫登泰山赋《望岳》时领悟","categoryName":"兵刃文玩","originCityName":"齐赵齐鲁"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  description = EXCLUDED.description,
  historical_story = EXCLUDED.historical_story,
  buffs = EXCLUDED.buffs,
  metadata = EXCLUDED.metadata;

INSERT INTO artifacts (id, name, category, rarity, description, historical_story, icon, poet_exclusive_id, city_origin_id, buffs, metadata)
VALUES (
  'artifact_huanhua_zhujian',
  '浣花素宣沉郁卷',
  'stationery',
  'rare',
  '沉郁顿挫的工笔诗卷，以沉重墨汁记载战乱流离与人间疾苦，被后世尊为“诗史”。',
  '杜甫《寄李十二白二十)》：“笔落惊风雨，诗成泣鬼神。声名从此大，汩没一朝伸。”',
  '📜',
  'du_fu',
  'chengdu',
  '{"melancholy":15,"inspiration":10}'::jsonb,
  '{"quote":"笔落惊风雨，诗成泣鬼神。","obtainMethod":"完成《春望》或《登高》格律推敲","categoryName":"笔墨碑拓","originCityName":"锦官城"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  description = EXCLUDED.description,
  historical_story = EXCLUDED.historical_story,
  buffs = EXCLUDED.buffs,
  metadata = EXCLUDED.metadata;

INSERT INTO artifacts (id, name, category, rarity, description, historical_story, icon, poet_exclusive_id, city_origin_id, buffs, metadata)
VALUES (
  'artifact_dongpo_liji',
  '东坡风雨笠屐',
  'relic',
  'legendary',
  '东坡在贬谪儋州与黄州途中的传世神品：头戴箬笠、脚著木屐，行于风雨泥泞之中而谈笑自若。千秋旷达豁然的极致符号。',
  '宋代费衮《梁溪漫志》：“东坡在儋耳，一日泛水访黎子云，途中值大雨，借笠屐穿之，妇人小儿相随争笑，邑犬争吠，东坡曰：‘吠所怪也。’图画至今。”',
  '🩴',
  'su_shi',
  'huangzhou',
  '{"serenity":25,"pride":15}'::jsonb,
  '{"quote":"莫听穿林打叶声，何妨吟啸且徐行。竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。","obtainMethod":"苏轼黄州顿悟或推敲《定风波》达成","categoryName":"传家古物","originCityName":"黄州/琼州"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  description = EXCLUDED.description,
  historical_story = EXCLUDED.historical_story,
  buffs = EXCLUDED.buffs,
  metadata = EXCLUDED.metadata;

INSERT INTO artifacts (id, name, category, rarity, description, historical_story, icon, poet_exclusive_id, city_origin_id, buffs, metadata)
VALUES (
  'artifact_weirou_shidan',
  '黄州煨肉法帖',
  'food',
  'epic',
  '黄州贬官贫窘，东坡亲作《猪肉颂》，以小火慢煨之法烹制至美之味。苦难中的人间烟火与生活禅意，尽入此帖。',
  '苏轼《猪肉颂》：“黄州好猪肉，价贱如泥土。贵者不肯吃，贫者不解煮。早晨起来打两碗，饱得自家君莫管。”',
  '🍲',
  'su_shi',
  'huangzhou',
  '{"serenity":15,"inspiration":15}'::jsonb,
  '{"quote":"净洗铛，少著水，柴头罨烟焰不起。待他自熟莫催他，火候足时他自美。","obtainMethod":"探索黄州雪堂或完成《定风波》推敲","categoryName":"珍馐食单","originCityName":"黄州雪堂"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  description = EXCLUDED.description,
  historical_story = EXCLUDED.historical_story,
  buffs = EXCLUDED.buffs,
  metadata = EXCLUDED.metadata;

INSERT INTO artifacts (id, name, category, rarity, description, historical_story, icon, poet_exclusive_id, city_origin_id, buffs, metadata)
VALUES (
  'artifact_hainan_chenxiang',
  '海南奇楠沉香枕',
  'relic',
  'epic',
  '取自黎母山深处的奇楠沉香。东坡被逐天涯海角，以此幽沉之香通灵宁神，照见其“问汝平生功业，黄州惠州儋州”的超然灵魂。',
  '苏轼《沉香山子赋》：“既金坚而玉润，亦鹤骨而龙筋。惟膏液之凝结，随地中之所侵。”',
  '🪵',
  'su_shi',
  'huangzhou',
  '{"serenity":20,"inspiration":10}'::jsonb,
  '{"quote":"九死南荒吾不恨，兹游奇绝冠平生。","obtainMethod":"达成苏轼晚年终局或经历时代危难","categoryName":"传家古物","originCityName":"琼州儋耳"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  description = EXCLUDED.description,
  historical_story = EXCLUDED.historical_story,
  buffs = EXCLUDED.buffs,
  metadata = EXCLUDED.metadata;

INSERT INTO artifacts (id, name, category, rarity, description, historical_story, icon, poet_exclusive_id, city_origin_id, buffs, metadata)
VALUES (
  'artifact_chaoran_chazhan',
  '超然台天青茶盏',
  'tea_wine',
  'rare',
  '汝窑天青色宋瓷盏，温润如雨后晴云。手持此盏，在超然台上把盏试新茶，笑对人间浮沉。',
  '苏轼《望江南·超然台作》：“春未老，风细柳斜斜。试上超然台上看，半壕春水一城花。且将新火试新茶。诗酒趁年华。”',
  '🍵',
  'su_shi',
  'kaifeng',
  '{"serenity":15,"pride":10}'::jsonb,
  '{"quote":"休对故人思故国，且将新火试新茶。诗酒趁年华。","obtainMethod":"游历密州或推敲《水调歌头》","categoryName":"佳酿香茗","originCityName":"密州超然台"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  description = EXCLUDED.description,
  historical_story = EXCLUDED.historical_story,
  buffs = EXCLUDED.buffs,
  metadata = EXCLUDED.metadata;

INSERT INTO artifacts (id, name, category, rarity, description, historical_story, icon, poet_exclusive_id, city_origin_id, buffs, metadata)
VALUES (
  'artifact_jinshilu_taoben',
  '《金石录》商周彝器残拓',
  'stationery',
  'legendary',
  '李清照与赵明诚耗尽三十年心血考订的金石图籍拓本。战乱中孤身护载，字字皆凝结着亡国之痛与千古至情。',
  '李清照《金石录后序》：“每获一书，即同共校勘，整集签题……指堆积书史，言某事在某书某卷第几页第几行，以中否角胜负，为饮茶先后。中即举杯大笑，至茶倾覆怀中，反不得饮而起。”',
  '📜',
  'li_qingzhao',
  'kaifeng',
  '{"serenity":20,"melancholy":15}'::jsonb,
  '{"quote":"甘心老是乡矣！收商周大鼎十数，汉唐石刻数百卷。","obtainMethod":"易安居士与赵明诚汴京结发或相国寺典衣寻宝获得","categoryName":"笔墨碑拓","originCityName":"汴京/青州"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  description = EXCLUDED.description,
  historical_story = EXCLUDED.historical_story,
  buffs = EXCLUDED.buffs,
  metadata = EXCLUDED.metadata;

INSERT INTO artifacts (id, name, category, rarity, description, historical_story, icon, poet_exclusive_id, city_origin_id, buffs, metadata)
VALUES (
  'artifact_shuyu_guqin',
  '漱玉泉七弦古琴',
  'relic',
  'epic',
  '济南章丘老泉畔所拂之焦尾琴。琴声如漱玉飞雪，伴随少女时代划舟惊起一滩鸥鹭的明媚时光。',
  '辛弃疾《济南府题壁》：“清照旧居漱玉泉，石骨棱层琴韵咽。” 易安词风“用字奇警，哀婉缠绵，卓绝古今”。',
  '🪕',
  'li_qingzhao',
  'jinan',
  '{"inspiration":20,"serenity":10}'::jsonb,
  '{"quote":"倚楼无语理瑶琴，一曲清歌两行泪。","obtainMethod":"词宗李清照初始家传乐器","categoryName":"传家古物","originCityName":"济南历下"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  description = EXCLUDED.description,
  historical_story = EXCLUDED.historical_story,
  buffs = EXCLUDED.buffs,
  metadata = EXCLUDED.metadata;

INSERT INTO artifacts (id, name, category, rarity, description, historical_story, icon, poet_exclusive_id, city_origin_id, buffs, metadata)
VALUES (
  'artifact_xiangguosi_qingshan',
  '相国寺典衣青衫',
  'relic',
  'rare',
  '新婚之时囊中羞涩，夫妇二人典当质换随身青衫，换得铜钱奔赴大相国寺淘购碑拓与奇石，清贫而欢喜的文人至乐。',
  '《金石录后序》：“后二年，出仕做吏，便有远别之恨……后屏居乡里十年，仰取俯拾，衣食粗完，乃益励精聚书。”',
  '👘',
  'li_qingzhao',
  'kaifeng',
  '{"serenity":15,"pride":10}'::jsonb,
  '{"quote":"质衣取半千，诣相国寺，市碑文果实归，相对展玩咀嚼。","obtainMethod":"游历至汴京大相国寺时触发","categoryName":"传家古物","originCityName":"汴京相国寺"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  description = EXCLUDED.description,
  historical_story = EXCLUDED.historical_story,
  buffs = EXCLUDED.buffs,
  metadata = EXCLUDED.metadata;

INSERT INTO artifacts (id, name, category, rarity, description, historical_story, icon, poet_exclusive_id, city_origin_id, buffs, metadata)
VALUES (
  'artifact_zemeng_mudiao',
  '双溪舴艋木雕小舟',
  'relic',
  'rare',
  '避乱浙东孤苦无依之时所雕扁舟。小小舴艋舟乘不下故国沦丧、丈夫早逝、文物尽失的三重浩劫之愁。',
  '李清照《武陵春·春晚》：“闻说双溪春尚好，也拟泛轻舟。只恐双溪舴艋舟，载不动许多愁。”',
  '🛶',
  'li_qingzhao',
  'hangzhou',
  '{"melancholy":20,"inspiration":10}'::jsonb,
  '{"quote":"只恐双溪舴艋舟，载不动许多愁。","obtainMethod":"推敲《声声慢》或经历靖康南渡大事件","categoryName":"传家古物","originCityName":"金华双溪"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  description = EXCLUDED.description,
  historical_story = EXCLUDED.historical_story,
  buffs = EXCLUDED.buffs,
  metadata = EXCLUDED.metadata;

-- 7. 千古文人同框羁绊
INSERT INTO encounters (id, primary_poet_id, secondary_poet_id, year, location_id, title, description, dialogues, gift_poem_id, bond_seal, metadata)
VALUES (
  'encounter_li_du_744',
  'li_bai',
  'du_fu',
  744,
  'luoyang',
  '双星并峙 · 李杜洛阳初会',
  '闻一多先生在《唐诗杂论》中盛赞：“四千年来中国文学史上最璀璨的神圣会晤，犹如青天里太阳和月亮走碰了头，我们该当如何庆祝这一个大碰撞！”

公元744年，四十四岁的李白刚因权贵谗谄，被唐玄宗“赐金放还”，傲岸步出长安帝都；而三十三岁的杜甫正在洛阳客居漫游。诗坛谪仙与未来诗圣在此刻历史性相遇！两人一见如故、恨晚情深，随后邀约高适同游梁宋、策马齐鲁，白日策马驰猎、夜间抵足而眠，开创盛唐文学最磅礴的双峰并峙。',
  '[{"speakerId":"du_fu","speakerName":"杜甫","speakerTitle":"洛阳客旅 · 时年三十三","avatarText":"子美","avatarImage":"/images/poets/du_fu.svg","quote":"“笔落惊风雨，诗成泣鬼神！”","text":"太白兄！常闻翰林大名，如雷贯耳！今日在东都酒肆得睹仙姿，玄宗赐金放还，朝中宵小安识真国士？兄长骨相天成，何必郁郁于金马玉堂！"},{"speakerId":"li_bai","speakerName":"李白","speakerTitle":"青莲居士 · 时年四十四","avatarText":"太白","avatarImage":"/images/poets/li_bai.jpg","quote":"“仰天大笑出门去，我辈岂是蓬蒿人！”","text":"哈哈哈哈！子美贤弟！吾观君《望岳》“会当凌绝顶，一览众山小”，真乃吞吐天地之句！长安浊气扑面，哪及洛阳天地开阔？走！唤上高达夫（高适），随我痛饮狂歌，策马登吹台而啸八荒！"},{"speakerId":"du_fu","speakerName":"杜甫","speakerTitle":"洛阳客旅 · 时年三十三","avatarText":"子美","avatarImage":"/images/poets/du_fu.svg","quote":"“醉眠秋共被，携手日同行。”","text":"固所愿也，不敢请耳！秋来相顾，痛饮狂歌，弟愿与兄策马梁宋，日夕畅谈诗道与天下苍生！"},{"speakerId":"li_bai","speakerName":"李白","speakerTitle":"青莲居士 · 时年四十四","avatarText":"太白","avatarImage":"/images/poets/li_bai.jpg","quote":"“思君若汶水，浩荡寄南征。”","text":"好！青山不老，绿水长流！千载之后，盛唐青史必记你我今日一聚！"}]'::jsonb,
  NULL,
  '{"subtitle":"公元744年（天宝三载）· 东都洛阳 · 梁宋齐鲁壮游","secondaryPoet":{"name":"杜甫","courtesyName":"子美","title":"少陵才俊 · 诗圣","avatarText":"子美","avatarImage":"/images/poets/du_fu.svg","color":"#B45309","age":33,"bioBrief":"少陵野老，早年读书开封洛阳，壮游齐赵，胸怀“会当凌绝顶，一览众山小”之万丈豪情，对太白倾心仰慕。"}}'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  dialogues = EXCLUDED.dialogues,
  bond_seal = EXCLUDED.bond_seal;

INSERT INTO encounters (id, primary_poet_id, secondary_poet_id, year, location_id, title, description, dialogues, gift_poem_id, bond_seal, metadata)
VALUES (
  'encounter_su_foyin_1080',
  'su_shi',
  'fo_yin',
  1080,
  'huangzhou',
  '元丰清风 · 东坡佛印禅悟',
  '公元1080年，苏轼经历“乌台诗案”死里逃生，贬黄州团练副使，本州安置，不得签书公事。正是人生的至暗时刻，苏轼在东坡筑雪堂，躬耕自给自足。高僧佛印禅师渡江相访，二人常泛舟赤壁之下，夜宿临皋亭，在诗酒与机锋辨析中顿悟生死荣辱，成就了千古词圣的超然旷达之境。',
  '[{"speakerId":"su_shi","speakerName":"苏轼","speakerTitle":"东坡居士 · 乌台余生","avatarText":"东坡","avatarImage":"/images/poets/su_shi.jpg","quote":"“问汝平生功业，黄州惠州儋州。”","text":"大和尚！我苏子瞻一生直言，竟被小人下狱百日，投置黄州冷板凳。今日在东坡开荒筑屋，泥污芒鞋，可还像当年那个名满汴京的翰林学士？"},{"speakerId":"fo_yin","speakerName":"佛印","speakerTitle":"佛印了元禅师","avatarText":"佛印","quote":"“八风吹不动，端坐紫金莲。”","text":"学士着相矣！昔日汴京金鞍骏马，不过是过眼云烟。今日黄州泥腿农夫，方悟得天地本真！不经一番寒彻骨，安得赤壁“大江东去”之旷达？"},{"speakerId":"su_shi","speakerName":"苏轼","speakerTitle":"东坡居士 · 乌台余生","avatarText":"东坡","avatarImage":"/images/poets/su_shi.jpg","quote":"“一蓑烟雨任平生，也无风雨也无晴。”","text":"妙哉！江上之清风，与山间之明月，耳得之而为声，目遇之而成色，取之无禁，用之不竭！走，我新煨好了东坡肉，与你这酒肉和尚大嚼三百壶！"}]'::jsonb,
  NULL,
  '{"subtitle":"公元1080年（元丰三年）· 湖北黄州 · 赤壁泛舟","secondaryPoet":{"name":"佛印","courtesyName":"了元","title":"云居高僧 · 禅宗尊宿","avatarText":"佛印","color":"#0D9488","age":49,"bioBrief":"字了元，宋代著名高僧，博通内外典籍，机智绝伦，与苏东坡相交数十载，亦师亦友，谐谑机锋留名千古。"}}'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  dialogues = EXCLUDED.dialogues,
  bond_seal = EXCLUDED.bond_seal;

INSERT INTO encounters (id, primary_poet_id, secondary_poet_id, year, location_id, title, description, dialogues, gift_poem_id, bond_seal, metadata)
VALUES (
  'encounter_qingzhao_zhaomingcheng_1101',
  'li_qingzhao',
  'zhao_mingcheng',
  1101,
  'kaifeng',
  '金石良缘 · 汴京赌书泼茶',
  '建中靖国元年，十八岁的李清照与二十一岁的太学生赵明诚结为连理。新婚燕尔，二人节衣缩食，每逢初一、十五便步行至开封大相国寺，典质衣物搜罗古籍残简、商周彝器、汉唐碑拓。

归家后相对烹茶，指堆积如山的经史百家，猜某事在某书某卷某页某行，猜中者先饮，往往举杯大笑，茶倾怀中，反不得饮。这一幕“赌书消得泼茶香”，成为了中国古代文人婚姻中最美好的爱情丰碑。',
  '[{"speakerId":"zhao_mingcheng","speakerName":"赵明诚","speakerTitle":"太学诸生 · 时年二十一","avatarText":"德父","quote":"“言与司合，安上已脱，怎当他钓鳌客？”","text":"易安！今日在大相国寺后廊，从古董商手中淘得汉代《石门颂》整纸未断拓本！虽典尽我这身貂裘，然古墨沉凝，刀法如神，真乃人间至宝！"},{"speakerId":"li_qingzhao","speakerName":"李清照","speakerTitle":"济南李氏 · 时年十八","avatarText":"易安","avatarImage":"/images/poets/li_qingzhao.svg","quote":"“卖花担上，买得一枝春欲放。”","text":"德父何必惜一件貂裘？古纸千载不朽，貂裘过冬即弊！来，水已初沸，且考你汉武帝封禅之语出于何策？若答不出，这第一盏龙井新茶便归我了！"},{"speakerId":"zhao_mingcheng","speakerName":"赵明诚","speakerTitle":"太学诸生 · 时年二十一","avatarText":"德父","quote":"“赌书消得泼茶香，当时只道是寻常。”","text":"哈哈，天下经史若论博闻强记，谁人及得过夫人？且饮且饮，愿与卿白首穷经，编成一部千古《金石录》！"}]'::jsonb,
  NULL,
  '{"subtitle":"公元1101年（建中靖国元年）· 汴京相许 · 金石之契","secondaryPoet":{"name":"赵明诚","courtesyName":"德父","title":"太学高足 · 金石宗匠","avatarText":"德父","color":"#047857","age":21,"bioBrief":"宰相赵挺之之子，金石考据学泰斗，与李清照志趣相投，琴瑟和鸣，三十年间倾尽家财搜求天下古器拓本，合著《金石录》。"}}'::jsonb,
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  dialogues = EXCLUDED.dialogues,
  bond_seal = EXCLUDED.bond_seal;

-- 8. 演示游历多槽位存档
INSERT INTO journey_saves (id, user_id, slot_index, slot_name, poet_id, current_year, current_location_id, mood, unlocked_poem_ids, poem_scores, unlocked_artifact_ids, unlocked_bond_ids, completed_event_ids, choices_made, journey_logs, is_active)
VALUES (
  'save_user01_slot1',
  'user_01',
  1,
  '【档一】太白纵酒入长安',
  'li_bai',
  744,
  'luoyang',
  '{"passion":80,"freedom":85,"sorrow":20,"anger":15,"homesickness":25}'::jsonb,
  '["wang_lu_shan_pu_bu","shu_dao_nan"]'::jsonb,
  '{"wang_lu_shan_pu_bu":100,"shu_dao_nan":100}'::jsonb,
  '["artifact_taibai_jian"]'::jsonb,
  '["encounter_li_du_744"]'::jsonb,
  '["li_bai_youth_sichuan","li_bai_visit_lu_shan_726"]'::jsonb,
  '{}'::jsonb,
  '[{"year":726,"location":"庐山","event":"望庐山瀑布，初试太白青锋"},{"year":742,"location":"长安","event":"供奉翰林，力士脱靴，天子呼来不上船"},{"year":744,"location":"洛阳","event":"赐金放还，遇少陵杜甫于东都，日与月相撞"}]'::jsonb,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  slot_name = EXCLUDED.slot_name,
  current_year = EXCLUDED.current_year,
  current_location_id = EXCLUDED.current_location_id,
  mood = EXCLUDED.mood,
  unlocked_poem_ids = EXCLUDED.unlocked_poem_ids,
  poem_scores = EXCLUDED.poem_scores,
  unlocked_artifact_ids = EXCLUDED.unlocked_artifact_ids,
  unlocked_bond_ids = EXCLUDED.unlocked_bond_ids,
  completed_event_ids = EXCLUDED.completed_event_ids,
  choices_made = EXCLUDED.choices_made,
  journey_logs = EXCLUDED.journey_logs,
  is_active = EXCLUDED.is_active;

INSERT INTO journey_saves (id, user_id, slot_index, slot_name, poet_id, current_year, current_location_id, mood, unlocked_poem_ids, poem_scores, unlocked_artifact_ids, unlocked_bond_ids, completed_event_ids, choices_made, journey_logs, is_active)
VALUES (
  'save_user01_slot2',
  'user_01',
  2,
  '【档二】东坡赤壁释怀卷',
  'su_shi',
  1082,
  'huangzhou',
  '{"passion":80,"freedom":85,"sorrow":20,"anger":15,"homesickness":25}'::jsonb,
  '["wang_lu_shan_pu_bu","shu_dao_nan"]'::jsonb,
  '{"wang_lu_shan_pu_bu":100,"shu_dao_nan":100}'::jsonb,
  '["artifact_taibai_jian"]'::jsonb,
  '["encounter_li_du_744"]'::jsonb,
  '["li_bai_youth_sichuan","li_bai_visit_lu_shan_726"]'::jsonb,
  '{}'::jsonb,
  '[{"year":1079,"location":"汴京","event":"乌台诗案，九死一生，移贬黄州"},{"year":1082,"location":"黄州","event":"赤壁怀古，微雨竹杖芒鞋，一蓑烟雨任平生"}]'::jsonb,
  FALSE
) ON CONFLICT (id) DO UPDATE SET
  slot_name = EXCLUDED.slot_name,
  current_year = EXCLUDED.current_year,
  current_location_id = EXCLUDED.current_location_id,
  mood = EXCLUDED.mood,
  unlocked_poem_ids = EXCLUDED.unlocked_poem_ids,
  poem_scores = EXCLUDED.poem_scores,
  unlocked_artifact_ids = EXCLUDED.unlocked_artifact_ids,
  unlocked_bond_ids = EXCLUDED.unlocked_bond_ids,
  completed_event_ids = EXCLUDED.completed_event_ids,
  choices_made = EXCLUDED.choices_made,
  journey_logs = EXCLUDED.journey_logs,
  is_active = EXCLUDED.is_active;

INSERT INTO journey_saves (id, user_id, slot_index, slot_name, poet_id, current_year, current_location_id, mood, unlocked_poem_ids, poem_scores, unlocked_artifact_ids, unlocked_bond_ids, completed_event_ids, choices_made, journey_logs, is_active)
VALUES (
  'save_user01_slot3',
  'user_01',
  3,
  '【档三】易安金石赌茶卷',
  'li_qingzhao',
  1108,
  'qingzhou',
  '{"passion":80,"freedom":85,"sorrow":20,"anger":15,"homesickness":25}'::jsonb,
  '["wang_lu_shan_pu_bu","shu_dao_nan"]'::jsonb,
  '{"wang_lu_shan_pu_bu":100,"shu_dao_nan":100}'::jsonb,
  '["artifact_taibai_jian"]'::jsonb,
  '["encounter_li_du_744"]'::jsonb,
  '["li_bai_youth_sichuan","li_bai_visit_lu_shan_726"]'::jsonb,
  '{}'::jsonb,
  '[{"year":1101,"location":"汴京","event":"相国寺典衣买古碑，归来堂初试墨法"},{"year":1108,"location":"青州","event":"屏居青州十载，赌书消得泼茶香，研治《金石录》"}]'::jsonb,
  FALSE
) ON CONFLICT (id) DO UPDATE SET
  slot_name = EXCLUDED.slot_name,
  current_year = EXCLUDED.current_year,
  current_location_id = EXCLUDED.current_location_id,
  mood = EXCLUDED.mood,
  unlocked_poem_ids = EXCLUDED.unlocked_poem_ids,
  poem_scores = EXCLUDED.poem_scores,
  unlocked_artifact_ids = EXCLUDED.unlocked_artifact_ids,
  unlocked_bond_ids = EXCLUDED.unlocked_bond_ids,
  completed_event_ids = EXCLUDED.completed_event_ids,
  choices_made = EXCLUDED.choices_made,
  journey_logs = EXCLUDED.journey_logs,
  is_active = EXCLUDED.is_active;

-- 9. 推敲答卷与错题集
INSERT INTO poem_study_records (id, user_id, save_slot_id, poem_id, mode, score, grade, duration_seconds, mistakes, extra_data)
VALUES (
  'rec_01',
  'user_01',
  'save_user01_slot1',
  'shu_dao_nan',
  'assembly',
  100,
  '甲等·妙品',
  42,
  '[]'::jsonb,
  '{"poetName":"李白","poemTitle":"蜀道难","completedAtText":"天宝三载 · 洛阳"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO poem_study_records (id, user_id, save_slot_id, poem_id, mode, score, grade, duration_seconds, mistakes, extra_data)
VALUES (
  'rec_02',
  'user_01',
  'save_user01_slot1',
  'wang_yue',
  'assembly',
  75,
  '乙等·通达',
  58,
  '[{"lineIndex":1,"charIndex":4,"lineSnippet":"齐鲁青未【？】","chosenOption":"尽","correctOption":"了","explanation":"“了”字出其不意，化静态山色为动态天工，写尽泰山青翠绵延无尽之神韵；若用“尽”字过于平直，失却诗意顿挫。"}]'::jsonb,
  '{"poetName":"杜甫","poemTitle":"望岳","completedAtText":"开元二十四年 · 泰山"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO poem_study_records (id, user_id, save_slot_id, poem_id, mode, score, grade, duration_seconds, mistakes, extra_data)
VALUES (
  'rec_03',
  'user_01',
  'save_user01_slot1',
  'ding_feng_bo',
  'assembly',
  100,
  '甲等·妙品',
  35,
  '[]'::jsonb,
  '{"poetName":"苏轼","poemTitle":"定风波 · 莫听穿林打叶声","completedAtText":"元丰五年 · 黄州"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO poem_study_records (id, user_id, save_slot_id, poem_id, mode, score, grade, duration_seconds, mistakes, extra_data)
VALUES (
  'rec_04',
  'user_01',
  'save_user01_slot1',
  'ru_meng_ling_xi_ting',
  'assembly',
  50,
  '丙等·尚可',
  76,
  '[{"lineIndex":2,"charIndex":2,"lineSnippet":"误入藕花【？】处","chosenOption":"岸","correctOption":"深","explanation":"“深”字极言荷花茂密参天，扁舟误入迷途之境；“岸”字则落入俗套，全无归舟不辨方向之醉眼朦胧感。"}]'::jsonb,
  '{"poetName":"李清照","poemTitle":"如梦令 · 常记溪亭日暮","completedAtText":"建中靖国元年 · 汴京"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 10. 文心墨札笔记
INSERT INTO poetry_notes (id, user_id, poem_id, poet_id, location_id, title, content, tags, bookmark_style, metadata)
VALUES (
  'note_01',
  'user_01',
  'wang_yue',
  'du_fu',
  NULL,
  '《望岳》“造化钟神秀”推敲感悟',
  '读到“造化钟神秀，阴阳割昏晓”，方知泰山之巍峨并非直白陈述，而是造物者将天地灵秀一股脑儿“钟”聚于此。一个“割”字，更是把山南之明朗与山北之幽暗劈裂成两个世界，杜少陵青年时期的胸襟气魄跃然纸上！',
  '["名句赏析","杜甫登高","造化钟灵"]'::jsonb,
  '{"styleTheme":"jade"}'::jsonb,
  '{"poemTitle":"望岳","poetName":"杜甫","locationName":"泰山","createdAtText":"2026-10-28 14:15"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  tags = EXCLUDED.tags,
  bookmark_style = EXCLUDED.bookmark_style,
  metadata = EXCLUDED.metadata;

INSERT INTO poetry_notes (id, user_id, poem_id, poet_id, location_id, title, content, tags, bookmark_style, metadata)
VALUES (
  'note_02',
  'user_01',
  'nian_nu_jiao_chi_bi_huai_gu',
  'su_shi',
  'huangzhou',
  '黄州赤壁怀古推敲：一尊还酹江月',
  '推敲“人生如梦，一尊还酹江月”时，联想苏子当时乌台诗案劫后余生。赤壁矶头水声如雷，英雄周郎已逝，自身亦双鬓华发。这一尊酒敬给倒映在长江中的冷月，是对苦难的彻底释怀，非大豪放者不可为。',
  '["人生感怀","东坡旷达","背诵心法"]'::jsonb,
  '{"styleTheme":"jade"}'::jsonb,
  '{"poemTitle":"念奴娇 · 赤壁怀古","poetName":"苏轼","locationName":"黄州","createdAtText":"2026-10-27 20:30"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  tags = EXCLUDED.tags,
  bookmark_style = EXCLUDED.bookmark_style,
  metadata = EXCLUDED.metadata;

INSERT INTO poetry_notes (id, user_id, poem_id, poet_id, location_id, title, content, tags, bookmark_style, metadata)
VALUES (
  'note_03',
  'user_01',
  NULL,
  'li_qingzhao',
  'qingzhou',
  '青州归来堂赌书泼茶小记',
  '易安居士与赵明诚在归来堂中，饭后烹茶，指堆积书史，说某事在某书某卷第几页第几行，以角胜负，中者举杯大笑，至茶倾覆怀中。文人夫妻之雅趣，千载之下仍令人神往！',
  '["金石考据","易安逸事","赌书泼茶"]'::jsonb,
  '{"styleTheme":"jade"}'::jsonb,
  '{"poemTitle":"金石录后序","poetName":"李清照","locationName":"青州","createdAtText":"2026-10-26 16:20"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  tags = EXCLUDED.tags,
  bookmark_style = EXCLUDED.bookmark_style,
  metadata = EXCLUDED.metadata;
