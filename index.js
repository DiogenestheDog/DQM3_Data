import {readFile, writeFile} from 'fs/promises';

const grabFile = async (path) => {
    try {
        const data = await readFile(path, 'utf-8');
        return JSON.parse(data);
    } catch(error) {
        console.error(`couldn't read file ${path}`, error.message);
    }
};

const monsters = await grabFile('./data/Monster.json');
const syntheses = await grabFile('./data/MonsterSynthesis.json');

const findMonsterById = monsterId => {
    return monsters.find(monster => {
        return monster.MonsterId === monsterId;
    });
};

const grandparentSynths = syntheses.filter(synth => {
    return synth.MonsterGrandParent1AId;
});

const gpSynthsWithNames = grandparentSynths.map(synth => {
    const gpSynth = {
        "name": findMonsterById(synth.MonsterResultId).Name,
        "gp1": findMonsterById(synth.MonsterGrandParent1AId).Name,
        "gp2": findMonsterById(synth.MonsterGrandParent1BId).Name,
        "gp3": findMonsterById(synth.MonsterGrandParent2AId).Name,
        "gp4": findMonsterById(synth.MonsterGrandParent2BId).Name
    };
    return gpSynth;
})

const writeJson = async (data, fileName) => {
    try {
        await writeFile(fileName, JSON.stringify(data));
        console.log(`File: ${fileName} written successfully`);
    } catch (error) {
        console.log(error);
    }
}

writeJson(gpSynthsWithNames, 'grandparent_synths.txt');

const jsonFormatter = json => {
    return json.reduce( (txtFile, monster) => {
        return txtFile + `
=======| ${monster.name} |=======
${monster.gp1}
${monster.gp2}
${monster.gp3}
${monster.gp4}
`
    }, "");
};
console.log(jsonFormatter(gpSynthsWithNames));
// console.log(gpSynthsWithNames);

//      MONSTER OBJ
// {
//     MonsterId: 132,
//     FamilyId: 6,
//     RankId: 2,
//     Number: 373,
//     Name: 'Cannonbrawler',
//     JapaneseName: 'ランドセーラー',
//     FrenchName: 'Cannoniais',
//     Identifier: 'cannonbrawler',
//     HP: 2,
//     MP: 2,
//     Att: 3,
//     Def: 2,
//     Agi: 2,
//     Wis: 1,
//     MaxHP: 1360,
//     MaxMP: 430,
//     MaxAtt: 690,
//     MaxDef: 380,
//     MaxAgi: 460,
//     MaxWis: 350,
//     Trivia: '',
//     EggTypeId: null
//   },

//      SYNTHESIS OBJ
// {
//     MonsterSynthesisId: 100,
//     MonsterResultId: 264,
//     MonsterParent1Id: 223,
//     MonsterGrandParent1AId: null,
//     MonsterGrandParent1BId: null,
//     MonsterParent2Id: 238,
//     MonsterGrandParent2AId: null,
//     MonsterGrandParent2BId: null,
//     AreBothRankSpecific: false
//   },
