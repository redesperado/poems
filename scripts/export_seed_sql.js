import { createServer } from 'vite';
import * as fs from 'fs';
import * as path from 'path';

// Helper to escape SQL single quotes
function sqlStr(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function sqlJson(obj) {
  if (obj === null || obj === undefined) return `'{}'::jsonb`;
  const jsonStr = JSON.stringify(obj).replace(/'/g, "''");
  return `'${jsonStr}'::jsonb`;
}

function sqlNum(num) {
  if (num === null || num === undefined || isNaN(num)) return 'NULL';
  return String(num);
}

async function run() {
  console.log('🚀 Loading game data using Vite SSR...');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const { LOCATIONS } = await vite.ssrLoadModule('./src/data/locations.ts');
  const { POET_PACKS, AVAILABLE_POETS } = await vite.ssrLoadModule('./src/data/poets/index.ts');
  const { POET_EXCLUSIVE_ARTIFACTS } = await vite.ssrLoadModule('./src/data/artifacts/index.ts');
  const { HISTORICAL_ENCOUNTERS } = await vite.ssrLoadModule('./src/data/encounters/index.ts');
  const {
    INITIAL_USER_ACCOUNTS,
    INITIAL_SAVE_SLOTS,
    INITIAL_STUDY_RECORDS,
    INITIAL_POETRY_NOTES,
  } = await vite.ssrLoadModule('./src/types/userStudio.ts');

  await vite.close();

  console.log(`Loaded:
  - Poets: ${AVAILABLE_POETS.length}
  - Locations: ${Object.keys(LOCATIONS).length}
  - Historical Encounters: ${Object.keys(HISTORICAL_ENCOUNTERS).length}
  - Users: ${INITIAL_USER_ACCOUNTS.length}
  - Save Slots: ${INITIAL_SAVE_SLOTS.length}
  - Study Records: ${INITIAL_STUDY_RECORDS.length}
  - Poetry Notes: ${INITIAL_POETRY_NOTES.length}
  `);

  const lines = [
    `-- =============================================================================`,
    `-- 《唐宋山河诗境》002 初始数据种子脚本 (Seed Data)`,
    `-- 自动生成时间: ${new Date().toISOString()}`,
    `-- 包含: 雅士用户、文人宗匠、名城舆图、传世诗篇、纪事分支、山河风物、千古相遇、游历存档与研学答卷`,
    `-- =============================================================================\n`,
  ];

  // 1. users
  lines.push(`-- 1. 雅士用户种子`);
  for (const user of INITIAL_USER_ACCOUNTS) {
    const sealChars = user.penName ? user.penName.slice(0, 4) + '印' : '文心之印';
    lines.push(`INSERT INTO users (id, username, password_hash, pen_name, avatar_icon, rank_title, level, exp, status, preferences, metadata)
VALUES (
  ${sqlStr(user.id)},
  ${sqlStr(user.username)},
  '$argon2id$v=19$m=19456,t=2,p=1$mock_hash_for_dev_only',
  ${sqlStr(user.penName)},
  ${sqlStr(user.avatarIcon)},
  ${sqlStr(user.rankTitle)},
  ${sqlNum(user.level)},
  ${sqlNum(user.exp)},
  'active',
  ${sqlJson({ theme: 'spring', sound: true, volume: 0.8 })},
  ${sqlJson({ sealStyle: 'stone', sealType: 'baiwen', sealChars, stats: user.stats, createdAtText: user.createdAt })}
) ON CONFLICT (id) DO UPDATE SET
  pen_name = EXCLUDED.pen_name,
  rank_title = EXCLUDED.rank_title,
  level = EXCLUDED.level,
  exp = EXCLUDED.exp,
  metadata = EXCLUDED.metadata;\n`);
  }

  // 2. locations
  lines.push(`-- 2. 名城舆图坐标`);
  for (const loc of Object.values(LOCATIONS)) {
    const provinceMatch = loc.name_modern ? loc.name_modern.slice(0, 2) : '华夏';
    lines.push(`INSERT INTO locations (id, name, modern_name, dynasty, dynasty_names, lat, lng, province, description, historical_importance, specialty_artifact_id, scenery_tags, metadata)
VALUES (
  ${sqlStr(loc.id)},
  ${sqlStr(loc.name_cn)},
  ${sqlStr(loc.name_modern)},
  ${sqlStr(loc.dynasty_names?.tang ? 'tang' : 'song')},
  ${sqlJson(loc.dynasty_names || {})},
  ${sqlNum(loc.coordinates ? loc.coordinates[0] : 0)},
  ${sqlNum(loc.coordinates ? loc.coordinates[1] : 0)},
  ${sqlStr(provinceMatch)},
  ${sqlStr(loc.description || '')},
  ${sqlStr(loc.type === 'city' ? '天下名城' : loc.type === 'landmark' ? '人文胜迹' : '关塞名胜')},
  NULL,
  ${sqlJson(loc.connected_to || [])},
  ${sqlJson({ mapPosition: loc.mapPosition, mood_on_arrive: loc.mood_on_arrive, type: loc.type })}
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  modern_name = EXCLUDED.modern_name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  scenery_tags = EXCLUDED.scenery_tags,
  metadata = EXCLUDED.metadata;\n`);
  }

  // 3. poets
  lines.push(`-- 3. 文人宗匠大传`);
  const poetMeta = {
    li_bai: { courtesy: '太白', art: '青莲居士', birth_place: '蜀郡绵州昌明县青莲乡（今四川江油）' },
    du_fu: { courtesy: '子美', art: '少陵野老', birth_place: '河南巩县（今河南巩义）' },
    su_shi: { courtesy: '子瞻', art: '东坡居士', birth_place: '眉州眉山（今四川眉山）' },
    li_qingzhao: { courtesy: '易安', art: '易安居士', birth_place: '齐州章丘（今山东济南章丘）' },
  };

  let sortOrder = 1;
  for (const poet of AVAILABLE_POETS) {
    const meta = poetMeta[poet.id] || { courtesy: poet.name_cn, art: poet.title, birth_place: '华夏' };
    lines.push(`INSERT INTO poets (id, name, dynasty, courtesy_name, art_name, title, birth_year, death_year, birth_place, avatar_url, portrait_url, quotes, biography, start_location_id, start_year, initial_mood, attributes, metadata, status, sort_order)
VALUES (
  ${sqlStr(poet.id)},
  ${sqlStr(poet.name_cn)},
  ${sqlStr(poet.dynasty)},
  ${sqlStr(meta.courtesy)},
  ${sqlStr(meta.art)},
  ${sqlStr(poet.title)},
  ${sqlNum(poet.born)},
  ${sqlNum(poet.died)},
  ${sqlStr(meta.birth_place)},
  ${sqlStr(poet.avatar_image)},
  ${sqlStr(poet.avatar_image)},
  ${sqlJson([poet.famous_quote])},
  ${sqlStr(poet.bio_short)},
  ${sqlStr(poet.start_location_id)},
  ${sqlNum(poet.start_year)},
  ${sqlJson(poet.initial_mood)},
  ${sqlJson({ style: poet.style, theme_color: poet.theme_color, representative_poems: poet.representative_poems })},
  ${sqlJson({ brief_intro: poet.brief_intro, preferred_theme_id: poet.preferred_theme_id })},
  'active',
  ${sqlNum(sortOrder++)}
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  dynasty = EXCLUDED.dynasty,
  title = EXCLUDED.title,
  quotes = EXCLUDED.quotes,
  biography = EXCLUDED.biography,
  initial_mood = EXCLUDED.initial_mood,
  attributes = EXCLUDED.attributes,
  metadata = EXCLUDED.metadata;\n`);
  }

  // 4. poems
  lines.push(`-- 4. 传世名篇题库`);
  let poemCount = 0;
  for (const [poetId, pack] of Object.entries(POET_PACKS)) {
    for (const poem of pack.poems) {
      poemCount++;
      const paragraphs = poem.lines.map(l => l.text);
      const blanks = poem.lines
        .map((l, idx) => {
          if (l.blank_index === null || l.blank_index === undefined) return null;
          return {
            lineIndex: idx,
            charIndex: l.blank_index,
            correct: l.correct,
            options: l.options || [],
            explanation: l.correct_explanation || '',
            wrongExplanations: l.wrong_explanations || {},
          };
        })
        .filter(Boolean);

      const background =
        poem.lines.map(l => l.correct_explanation).filter(Boolean).join(' ') ||
        `${poem.title}创作于${poem.year ? poem.year + '年' : '盛世'}。`;

      lines.push(`INSERT INTO poems (id, poet_id, title, dynasty, year, location_id, form, background, paragraphs, blanks, pedagogy, tags, metadata)
VALUES (
  ${sqlStr(poem.id)},
  ${sqlStr(poetId)},
  ${sqlStr(poem.title)},
  ${sqlStr(poem.dynasty || 'tang')},
  ${sqlNum(poem.year)},
  ${sqlStr(poem.location_id)},
  ${sqlStr(poem.form === 'shi' ? '近体古诗' : poem.form === 'ci' ? '宋词词牌' : poem.form || '诗')},
  ${sqlStr(background)},
  ${sqlJson(paragraphs)},
  ${sqlJson(blanks)},
  ${sqlJson({ trigger_conditions: poem.trigger_conditions })},
  ${sqlJson([poem.dynasty, poem.form, poem.location_id].filter(Boolean))},
  ${sqlJson({})}
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  background = EXCLUDED.background,
  paragraphs = EXCLUDED.paragraphs,
  blanks = EXCLUDED.blanks,
  pedagogy = EXCLUDED.pedagogy,
  tags = EXCLUDED.tags;\n`);
    }
  }
  console.log(`Exported poems: ${poemCount}`);

  // 5. poet_events
  lines.push(`-- 5. 人生重大历史纪事与分支抉择`);
  let eventCount = 0;
  for (const [poetId, pack] of Object.entries(POET_PACKS)) {
    const choicesMap = pack.choices || {};
    let order = 1;
    for (const ev of pack.events) {
      eventCount++;
      let choicesList = [];
      for (const choice of Object.values(choicesMap)) {
        if (choice.event_id === ev.id) {
          choicesList.push(choice);
        }
      }

      lines.push(`INSERT INTO poet_events (id, poet_id, year, location_id, title, event_type, historical_context, narrative, triggered_poem_id, choices, mood_impact, requirements, metadata, sort_order)
VALUES (
  ${sqlStr(ev.id)},
  ${sqlStr(poetId)},
  ${sqlNum(ev.year)},
  ${sqlStr(ev.location_id)},
  ${sqlStr(ev.title)},
  ${sqlStr(ev.type || 'milestone')},
  ${sqlStr(ev.description)},
  ${sqlStr(ev.description)},
  ${sqlStr(ev.triggers_poem_id || null)},
  ${sqlJson(choicesList)},
  ${sqlJson(ev.mood_delta || {})},
  ${sqlJson({})},
  ${sqlJson({ next_event_id: ev.next_event_id, triggers_retrospective: ev.triggers_retrospective })},
  ${sqlNum(order++)}
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  historical_context = EXCLUDED.historical_context,
  narrative = EXCLUDED.narrative,
  triggered_poem_id = EXCLUDED.triggered_poem_id,
  choices = EXCLUDED.choices,
  mood_impact = EXCLUDED.mood_impact,
  metadata = EXCLUDED.metadata;\n`);
    }
  }
  console.log(`Exported events: ${eventCount}`);

  // 6. artifacts
  lines.push(`-- 6. 山河风物信物`);
  let artifactCount = 0;
  for (const [poetId, arts] of Object.entries(POET_EXCLUSIVE_ARTIFACTS)) {
    for (const art of arts) {
      artifactCount++;
      lines.push(`INSERT INTO artifacts (id, name, category, rarity, description, historical_story, icon, poet_exclusive_id, city_origin_id, buffs, metadata)
VALUES (
  ${sqlStr(art.id)},
  ${sqlStr(art.name)},
  ${sqlStr(art.category)},
  ${sqlStr(art.rarity)},
  ${sqlStr(art.description)},
  ${sqlStr(art.historicalProvenance || art.description)},
  ${sqlStr(art.icon)},
  ${sqlStr(art.poetExclusiveId || poetId)},
  ${sqlStr(art.originCityId || null)},
  ${sqlJson(art.moodBonus || {})},
  ${sqlJson({ quote: art.quote, obtainMethod: art.obtainMethod, categoryName: art.categoryName, originCityName: art.originCityName })}
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  description = EXCLUDED.description,
  historical_story = EXCLUDED.historical_story,
  buffs = EXCLUDED.buffs,
  metadata = EXCLUDED.metadata;\n`);
    }
  }
  console.log(`Exported artifacts: ${artifactCount}`);

  // 7. encounters
  lines.push(`-- 7. 千古文人同框羁绊`);
  let encounterCount = 0;
  for (const enc of Object.values(HISTORICAL_ENCOUNTERS)) {
    encounterCount++;
    lines.push(`INSERT INTO encounters (id, primary_poet_id, secondary_poet_id, year, location_id, title, description, dialogues, gift_poem_id, bond_seal, metadata)
VALUES (
  ${sqlStr(enc.id)},
  ${sqlStr(enc.primaryPoetId)},
  ${sqlStr(enc.secondaryPoetId)},
  ${sqlNum(enc.year)},
  ${sqlStr(enc.locationId)},
  ${sqlStr(enc.title)},
  ${sqlStr(enc.historicalNarrative)},
  ${sqlJson(enc.dialogues)},
  NULL,
  ${sqlJson({ subtitle: enc.subtitle, secondaryPoet: enc.secondaryPoet })},
  ${sqlJson({})}
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  dialogues = EXCLUDED.dialogues,
  bond_seal = EXCLUDED.bond_seal;\n`);
  }
  console.log(`Exported encounters: ${encounterCount}`);

  // 8. journey_saves
  lines.push(`-- 8. 演示游历多槽位存档`);
  let slotIdx = 1;
  const locationMap = {
    '洛阳': 'luoyang',
    '黄州': 'huangzhou',
    '青州': 'qingzhou',
    '庐山': 'lu_shan',
    '长安': 'chang_an',
  };

  for (const save of INITIAL_SAVE_SLOTS) {
    const locId = locationMap[save.locationName] || 'chang_an';
    lines.push(`INSERT INTO journey_saves (id, user_id, slot_index, slot_name, poet_id, current_year, current_location_id, mood, unlocked_poem_ids, poem_scores, unlocked_artifact_ids, unlocked_bond_ids, completed_event_ids, choices_made, journey_logs, is_active)
VALUES (
  ${sqlStr(`save_user01_slot${slotIdx}`)},
  'user_01',
  ${sqlNum(slotIdx)},
  ${sqlStr(save.slotName)},
  ${sqlStr(save.poetId)},
  ${sqlNum(save.currentYear)},
  ${sqlStr(locId)},
  ${sqlJson({ passion: 80, freedom: 85, sorrow: 20, anger: 15, homesickness: 25 })},
  ${sqlJson(['wang_lu_shan_pu_bu', 'shu_dao_nan'])},
  ${sqlJson({ wang_lu_shan_pu_bu: 100, shu_dao_nan: 100 })},
  ${sqlJson(['artifact_taibai_jian'])},
  ${sqlJson(['encounter_li_du_744'])},
  ${sqlJson(['li_bai_youth_sichuan', 'li_bai_visit_lu_shan_726'])},
  ${sqlJson({})},
  ${sqlJson(save.journeyLogs || [])},
  ${save.isActive ? 'TRUE' : 'FALSE'}
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
  is_active = EXCLUDED.is_active;\n`);
    slotIdx++;
  }

  // 9. poem_study_records
  lines.push(`-- 9. 推敲答卷与错题集`);
  for (const rec of INITIAL_STUDY_RECORDS) {
    lines.push(`INSERT INTO poem_study_records (id, user_id, save_slot_id, poem_id, mode, score, grade, duration_seconds, mistakes, extra_data)
VALUES (
  ${sqlStr(rec.id)},
  'user_01',
  'save_user01_slot1',
  ${sqlStr(rec.poemId)},
  'assembly',
  ${sqlNum(rec.score)},
  ${sqlStr(rec.grade)},
  ${sqlNum(rec.durationSeconds)},
  ${sqlJson(rec.mistakes || [])},
  ${sqlJson({ poetName: rec.poetName, poemTitle: rec.poemTitle, completedAtText: rec.completedAtText })}
) ON CONFLICT (id) DO NOTHING;\n`);
  }

  // 10. poetry_notes
  lines.push(`-- 10. 文心墨札笔记`);
  const poemIdMap = {
    '望岳': 'wang_yue',
    '念奴娇 · 赤壁怀古': 'nian_nu_jiao_chi_bi_huai_gu',
    '如梦令 · 常记溪亭日暮': 'ru_meng_ling',
    '蜀道难': 'shu_dao_nan',
  };
  const poetIdMap = {
    '李白': 'li_bai',
    '杜甫': 'du_fu',
    '苏轼': 'su_shi',
    '李清照': 'li_qingzhao',
  };

  for (const note of INITIAL_POETRY_NOTES) {
    const poemId = note.poemTitle ? poemIdMap[note.poemTitle] || null : null;
    const poetId = note.poetName ? poetIdMap[note.poetName] || null : null;
    const locId = note.locationName ? locationMap[note.locationName] || null : null;

    lines.push(`INSERT INTO poetry_notes (id, user_id, poem_id, poet_id, location_id, title, content, tags, bookmark_style, metadata)
VALUES (
  ${sqlStr(note.id)},
  'user_01',
  ${sqlStr(poemId)},
  ${sqlStr(poetId)},
  ${sqlStr(locId)},
  ${sqlStr(note.title)},
  ${sqlStr(note.content)},
  ${sqlJson(note.tags || [])},
  ${sqlJson({ styleTheme: 'jade' })},
  ${sqlJson({ poemTitle: note.poemTitle, poetName: note.poetName, locationName: note.locationName, createdAtText: note.createdAtText })}
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  tags = EXCLUDED.tags,
  bookmark_style = EXCLUDED.bookmark_style,
  metadata = EXCLUDED.metadata;\n`);
  }

  const outputPath = path.resolve('server/migrations/002_seed_data.sql');
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
  console.log(`✅ Seed migration written to: ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
}

run().catch(err => {
  console.error('❌ Error generating seed migration:', err);
  process.exit(1);
});
