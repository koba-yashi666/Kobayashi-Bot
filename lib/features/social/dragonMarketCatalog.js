const foods = [
  ['guarana','Guaraná','🥤',35], ['chocolate','Chocolate','🍫',30], ['acai','Açaí','🍧',55],
  ['monster','Monster','🥫',65], ['cheetos','Cheetos','🧀',25], ['toddynho','Toddynho','🧃',20],
  ['cocaina','Cocaína (item virtual)','📦',450], ['maconha','Maconha (item virtual)','🍃',200],
  ['cafe','Café','☕',20], ['pizza','Pizza','🍕',80], ['hamburguer','Hambúrguer','🍔',70],
  ['sushi','Sushi','🍣',90], ['sorvete','Sorvete','🍦',40], ['agua','Água','💧',10]
];
// Tempo em minutos e produção por semente: mecânica exclusivamente do jogo.
export const CROPS = [
  ['maca','Maçã','🍎',20,60,3], ['banana','Banana','🍌',15,45,3],
  ['morango','Morango','🍓',25,90,4], ['laranja','Laranja','🍊',18,60,3],
  ['uva','Uva','🍇',30,120,4], ['melancia','Melancia','🍉',40,180,3],
  ['abacaxi','Abacaxi','🍍',35,150,3], ['manga','Manga','🥭',28,120,3],
  ['alface','Alface','🥬',12,30,3], ['tomate','Tomate','🍅',18,60,4],
  ['cenoura','Cenoura','🥕',15,45,4], ['batata','Batata','🥔',20,90,4],
  ['milho','Milho','🌽',22,90,4], ['abobora','Abóbora','🎃',35,150,3],
  ['brocolis','Brócolis','🥦',25,120,4], ['cebola','Cebola','🧅',18,60,4],
  ['pimentao','Pimentão','🫑',25,90,4], ['trigo','Trigo','🌾',12,30,4],
  ['feijao','Feijão','🫘',20,90,4], ['pepino','Pepino','🥒',16,45,4]
].map(([id,name,icon,price,minutes,yieldQty])=>({id,name,icon,price,minutes,yieldQty}));
export const MARKET_ITEMS = [
  ...foods.map(([id,name,icon,price])=>({id,name,icon,price,type:'food',description:'Colecionável do mercado.'})),
  ...CROPS.flatMap(c=>[
    {id:c.id,name:c.name,icon:c.icon,price:c.price,type:'food',description:'Alimento do mercado.'},
    {id:`semente_${c.id}`,name:`Semente de ${c.name}`,icon:'🌱',price:c.price,type:'seed',description:`${c.minutes}min • produz ${c.yieldQty} unidades.`}
  ])
];
