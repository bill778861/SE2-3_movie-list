// 載入express
const express = require('express')
const app = express()
// 載入express-handlebars
const exphbs = require('express-handlebars')
// 變數:通訊埠數
const port = 3000
// 載入電影資料
const movieList = require('./movies.json')

// require():括號內字串若無提供路徑，則Node,js讀取時會預設是模組；若有提供路徑，則預設是某個檔案。
// "./": 代表目前編輯的檔案(app.js)所在的路徑
// 若Node,js判斷是要讀取檔案但卻沒有寫副檔名時，會依照以下順序副檔名嘗試讀取檔案：.js => .json => .node => 若依舊無法讀取檔案則報錯。





//// 設定在express中使用handlebars樣版引擎

// app.engine(): 定義要使用的樣版引擎
// 第一個參數： 此樣版引擎名稱
// 第二個參數： 此樣版引擎的相關設定。這裡defaultLayout(預設佈局)被設置為使用名稱為main.handlebars的檔案
app.engine('handlebars', exphbs({defaultLayout: 'main'}))

// app.set(): 告訴express要設定的view engine是名稱為"handlebars"的樣版引擎
app.set('view engine', 'handlebars')





//// 將bootstrap, popper...的檔案作為express的靜態檔案

// 靜態檔案(Static files)：通常不需要再經過伺服器額外處理的檔案。伺服器只需要提供一個連結，讓瀏覽器直接抓取這些檔案即可。
// app.use():無論使用哪條路由，都會先執行此方法內的內容。
// express.static('public'): 告知express，靜態檔案放置在名稱為public的資料夾中
app.use(express.static('public'))





//// 設定路由

// 根路徑(http://localhost:3000)
app.get('/', (req, res) => {
  // 以檔名為index.handlebars的部分樣版，搭配預設布局main.handlebars，進行渲染(解析HTML並繪製出瀏覽器裡的畫面)
  // 在res.render()的第二個變數，宣告物件的屬性名稱movies，並將movieList作為它的值。這個物件會被傳入index.handlebars中，使其可使用裡面的資料。
  res.render('index', {movies: movieList.results})
})

// 搜尋電影(http://localhost:3000/search?keyword=...)
app.get('/search', (req, res) => {
  // 路由的路徑中"?"之後的內容為查詢字串query string，可在req.query中取得其內容。
  const keyword = req.query.keyword
  
  const movies = movieList.results.filter(movie => movie.title.toLowerCase().includes(keyword.toLowerCase()))
  res.render('index', { movies: movies, keyword: keyword})
})

// 單一電影資訊(http://localhost:3000/movies/:movie_id)
// 動態路由：路由的路徑中":"後的movie_id為變數，可接受任何有效字串。其值可在req.params.movie_id找到。
app.get('/movies/:movie_id', (req, res) => {
  const movie = movieList.results.find(movie => movie.id.toString() === req.params.movie_id)
  // 雖然find()內的函式內容也可改成" movie.id === Number(req.params.movie_id) "，但若req.params.movie_id是空字串或null時(比如沒有選擇電影的時候)，Number()會回傳數字0，假設電影資料中恰有電影的id為0，則會發生電影被錯誤取出的情形。故" movie.id.toString() === req.params.movie_id "寫法較佳。

  res.render('show', {movie: movie})
})





//// 啟用並監聽伺服器
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})