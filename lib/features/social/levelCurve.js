export const LEVEL_CURVE_VERSION = 2;
export const MAX_LEVEL = 50;
export function levelCost(level = 1) {
  const lv=Math.max(1,Math.min(MAX_LEVEL,Math.floor(Number(level)||1)));
  if(lv>=MAX_LEVEL)return 0;
  if(lv<=10)return 200;
  if(lv<=20)return 350;
  if(lv<=30)return 500;
  if(lv<=40)return 700;
  return 900;
}
const oldCost=lv=>lv<=10?100:100+(lv-10)*25;
const totalFor=(level,cost)=>{let xp=0;for(let lv=1;lv<level;lv++)xp+=cost(lv);return xp;};
export function migrateLevelRow(row) {
  if(!row||typeof row!=='object'||Array.isArray(row)||row.levelCurveVersion===LEVEL_CURVE_VERSION)return false;
  if(!('xp' in row)&&!('level' in row))return false;
  const parsed=Number(row.xp||0),xp=Number.isFinite(parsed)?Math.max(0,parsed):0;
  let level=1;
  while(level<MAX_LEVEL&&totalFor(level+1,oldCost)<=xp)level++;
  const oldStart=totalFor(level,oldCost),nextStart=totalFor(level,levelCost);
  const carried=level<MAX_LEVEL?Math.floor((xp-oldStart)/oldCost(level)*levelCost(level)):xp-oldStart;
  row.xp=nextStart+Math.max(0,carried);
  row.level=level;
  row.levelCurveVersion=LEVEL_CURVE_VERSION;
  return true;
}
