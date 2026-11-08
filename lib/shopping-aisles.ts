export const AISLES=['Fruit & vegetables','Meat & fish','Dairy, eggs & alternatives','Bakery','Pasta, rice & grains','Tins, jars & pulses','Oils, sauces & condiments','Herbs & spices','Baking','Frozen','Snacks & sweets','Drinks','Household','Other'] as const;
export type Aisle=typeof AISLES[number];
const rules:[Aisle,RegExp][]=[
 ['Frozen',/\bfrozen\b/],
 ['Dairy, eggs & alternatives',/\b(milk|cheese|cheddar|feta|mozzarella|yogh?urt|cream|butter|eggs?|tofu|paneer|quark|skyr|kefir)\b/],
 ['Baking',/\b(flour|baking powder|bicarbonate|yeast|cocoa|sugar|protein powder|choc(?:olate)? (?:chips|chunks)|vanilla extract)\b/],
 ['Oils, sauces & condiments',/\b(oil|vinegar|sauce|ketchup|mayonnaise|mustard|pesto|stock|gravy|dressing|chutney|paste|honey|syrup|peanut butter)\b/],
 ['Tins, jars & pulses',/\b(tinned|canned|chickpeas?|lentils?|kidney beans?|butter beans?|baked beans?|passata|coconut milk)\b/],
 ['Meat & fish',/\b(chicken|turkey|beef|lamb|pork|bacon|ham|sausage|chorizo|salami|guanciale|salmon|tuna|cod|haddock|prawns?|shrimp|fish|steak|mince)\b/],
 ['Bakery',/\b(bread|wraps?|pitta|pita|bagels?|buns?|rolls?|croissants?|tortillas?)\b/],
 ['Pasta, rice & grains',/\b(pasta|rice|oats?|oatmeal|spaghetti|penne|noodles?|couscous|quinoa|bulgur|cereal|granola)\b/],
 ['Herbs & spices',/\b(salt|pepper|paprika|cumin|cinnamon|turmeric|oregano|thyme|rosemary|basil|parsley|coriander|nutmeg|spice|chilli flakes|bay leaves)\b/],
 ['Fruit & vegetables',/\b(apples?|bananas?|oranges?|lemons?|limes?|berries|blueberries|raspberries|strawberries|grapes?|pears?|peaches?|mango|pineapple|avocados?|tomatoes?|onions?|garlic|ginger|potatoes?|carrots?|broccoli|spinach|kale|lettuce|salad|cucumber|courgettes?|aubergines?|peppers?|mushrooms?|celery|leeks?|cabbage|cauliflower|peas|green beans|sweetcorn|squash|chillies|chilli)\b/],
 ['Snacks & sweets',/\b(chocolate|crisps|biscuits?|cookies?|nuts|almonds?|walnuts?|cashews?|popcorn)\b/],
 ['Drinks',/\b(water|juice|coffee|tea|kombucha|beer|wine|cola|lemonade)\b/],
 ['Household',/\b(soap|detergent|washing|cleaner|toilet|kitchen roll|foil|cling film|bin bags)\b/]
];
export function shoppingAisle(item:{name:string;aisle?:string}):Aisle{
 if(item.aisle&&AISLES.includes(item.aisle as Aisle))return item.aisle as Aisle;
 const name=item.name.toLowerCase();
 if(/\b(red|green|yellow|orange|bell) peppers?\b/.test(name))return 'Fruit & vegetables';
 // These contain words also found in dairy names.
 if(/\b(coconut milk|peanut butter|almond butter)\b/.test(name))return /milk/.test(name)?'Tins, jars & pulses':'Oils, sauces & condiments';
 return rules.find(([,pattern])=>pattern.test(name))?.[0]||'Other';
}
export function groupByAisle<T extends {name:string;aisle?:string}>(items:T[]):{aisle:Aisle;items:T[]}[]{
 const groups=new Map<Aisle,T[]>();for(const item of items){const aisle=shoppingAisle(item);if(!groups.has(aisle))groups.set(aisle,[]);groups.get(aisle)!.push(item);}return AISLES.filter(a=>groups.has(a)).map(aisle=>({aisle,items:groups.get(aisle)!}));
}
