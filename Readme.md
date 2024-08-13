# Backend with JS
#//Express routing ke liye kaam aata hai 
//Mongoose DB library hai 
//Node js is just a javascript runtime environment. javascript rn hotah ia bas uspe 
//index / main file is the entry point 
//usually jaise hi application start hui hai tab hum DB connect kardete hai. i.e index file me hi DB connection rehta hia 
//backend me JS me either FILE storage,DATA storage, third party api se interaction hoga 

/*FILE STRUCTURE
Package.json, .env
App : contains configuration such as cookies and all is included here
Constants: eg air ticket booking. we have only 3 types of tickets aisle, middle and window, so iske contants banayenge so that iske alawa kahise aur choose na karpaye customer
DIRECTORY STRUCTURE:
1)DB: actual code that connects the DB
2)Models: Data ka structure yahape banta hai, Data ka model banalo/ sample banalo 
3)Controllers : functionality jitni bhi hai woh controllers me likhi jaati hai. fucntions and methods 
4)Routes: /login pe aao toh ye function call hojaye, /signup pe ye function call hojaye. 
5)Middlewares
6)Utils: mail karna hai, woh kaafi jagah pe use hone wali functionality hai. so ye common functionality hai toh wo utils me aata hai 
7)More  


Backend design karne ke pehele ye question hona chahiye ki data points kya hia i.e kya store karna hia DB me 
-sabse pehele woh screen ko model karo jisme data save karna hai i.r register and not login(login me data authenticate karte hai )