const CITIES=["Москва","Санкт-Петербург","Нижний Новгород","Казань","Екатеринбург","Новосибирск","Самара","Воронеж","Краснодар","Ростов-на-Дону","Волгоград","Ставрополь","Астрахань","Сочи","Новороссийск","WB Коледино","Ozon Хоругвино","X5 Ворсино","СДЭК-Щербинка","Казань-Лаишево"];
const VEHICLES=[
 {name:"Газель",min:1,max:2.5},
 {name:"Валдай",min:2.6,max:3},
 {name:"Бычок 5 т",min:3,max:5},
 {name:"MAN 10 т",min:6,max:10},
 {name:"КамАЗ 20 т",min:12,max:20},
 {name:"DAF + Krone 20 т",min:12,max:20},
 {name:"Рефрижератор 5 т",min:3,max:5},
 {name:"Изотерм 3 т",min:2,max:3}
];
function rand(arr){return arr[Math.floor(Math.random()*arr.length)];}
function randNum(min,max){return Math.random()*(max-min)+min;}
function nextTickerText(){
 const veh=rand(VEHICLES);
 const weight=randNum(veh.min,veh.max).toFixed(1);
 let from=rand(CITIES);
 let to;
 do{to=rand(CITIES);}while(to===from);
 const mins=Math.floor(Math.random()*9)+1;
 return `${mins} мин назад: ${veh.name} · ${weight} т · ${from} → ${to}`;
}
function updateTicker(){
 const span=document.querySelector('.live-ticker span');
 if(span){span.textContent=nextTickerText();}
}
document.addEventListener('DOMContentLoaded',()=>{
 const ticker=document.querySelector('.live-ticker span');
 if(!ticker)return;
 updateTicker();
 setInterval(updateTicker,12000);
});