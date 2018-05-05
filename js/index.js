function $(node){
    return document.querySelector(node)
}
function $$(node){
    return document.querySelectorAll(node)
}

var currentIndex = 0 //歌曲序号
var musicList        //音乐库
var musicObj         //一首音乐的信息包
var song = new Audio()  //音频
var backwardBtn = $('.musicPanel .control .backward')
var forwardBtn = $('.musicPanel .control .forward')
var playBtn = $('.musicPanel .control .play')
var timeBar = $('.musicPanel .prograss .timeLine')
var listBtn = $('.musicPanel .control .list')
//ajax封装
function getMusic(callback){
    var xhr = new XMLHttpRequest()
    xhr.open('GET','https://github.com/Saraalwayslikeworld/music-player/blob/master/music.json',true)
    xhr.send()
    xhr.onload = function(req,res){
        if((xhr.status>=200 && xhr.status<300)||xhr.status===304){
            callback(JSON.parse(this.responseText))
          //  console.log(JSON.parse(this.responseText))
        }else{
            res.setHeader('contentType','text/html;charset=utf-8')
            res.end('<h1>服务器出错</h1>')
        }
    }
    xhr.onerror = function(){
        console.log(404,'error')
    }
}
//获取音乐
getMusic(function(musiclist){
    musicList = musiclist
    musicObj = musiclist[currentIndex]
   // $$('.musicBox li').forEach()
    //console.log(musicObj)
    loadmusic(musiclist[currentIndex])
    makelist(musiclist)
})
//音乐列表的数据载入
function makelist(list){
    console.log(list)
    var str = []
    for(var i=0; i<list.length; i++){
        str.push('<li>'+list[i].title +' - '+list[i].auther+'</li>') 
    }
    console.log(str.join(""))
    $('.musicBox>.list').innerHTML = str.join('')
}
//列表播放音乐
$('.musicBox>.list').onclick = function(e){
    //console.log(this.children)
    for(var i = 0; i < this.children.length; i++){
    if(this.children[i] === e.target){
    currentIndex = i
  }}
  loadmusic(musicList[currentIndex])
}
//换歌对当前音乐的操作
function loadmusic(musicObj){
    song.src = musicObj.src
    song.autoplay = true
    $('.songName').innerText = musicObj.title
    $('.singer').innerText = musicObj.auther
    $('#sm-img').src = musicObj.img
    $('.bg').style.backgroundImage = 'url(' + musicObj.img + ')'
    if(playBtn.firstChild.classList.contains('fa-play')){
        playBtn.firstChild.classList.toggle('fa-play')
        playBtn.firstChild.classList.toggle('fa-pause')
    }
    for(var i = 0; i < $('.musicBox>.list').children.length; i++){
        $('.musicBox>.list').children[i].classList.remove('playing') 
        $('.musicBox>.list').children[currentIndex].classList.add('playing') 
    }   
    
}
//音乐播放时进度条及时间变化
var clock
song.onplay = function(){
    var allsec = parseInt(song.duration%60)+' '
    var allmin = parseInt(song.duration/60)+' '
    allsec = (allsec.length==2)?('0'+allsec):allsec
    allmin = (allmin.length==2)?('0'+allmin):allmin
    $('.total').innerText = '/'+ allmin +':'+ allsec
    clock = setInterval(function(){
        var sec = parseInt(song.currentTime%60)+' '
        var min = parseInt(song.currentTime/60)+' '
        sec = (sec.length==2)?('0'+sec):sec
        min = (min.length==2)?('0'+min):min
        $('.now').innerText = min +':'+ sec
        $('.prograssNow').style.width = (song.currentTime/song.duration)*100 + '%'
    },1000)
}
song.onpause = function(){
    clearInterval(clock)
}
song.onended = function(){
    currentIndex = (++currentIndex)%musicList.length
    loadmusic(musicList[currentIndex]) 
} 
//播放控制
playBtn.onclick = function(){
    var icon = this.querySelector('.fa')
    if(icon.classList.contains('fa-pause')){
        song.pause()
    }else{
        song.play()
    }
    icon.classList.toggle('fa-play')
    icon.classList.toggle('fa-pause')
    $('.musicBox>.list').children[currentIndex].classList.toggle('playing') 
    $('.musicBox>.list').children[currentIndex].classList.toggle('pause') 
    
}
forwardBtn.onclick = function(){
    currentIndex = (++currentIndex)%musicList.length
    loadmusic(musicList[currentIndex])   
}
backwardBtn.onclick = function(){
    currentIndex = (--currentIndex +musicList.length)%musicList.length
    loadmusic(musicList[currentIndex])
}
//进度条的控制
timeBar.onclick = function(e){
    var line = parseInt(getComputedStyle($('.prograssTotal')).width)
    $('.prograssNow').style.width = (e.offsetX/line)*100 + '%'
    song.currentTime = song.duration*(e.offsetX/line)
}
//音乐列表的展示
listBtn.onclick = function(e){
    console.log(e)
    $('.musicBox>.list').classList.toggle('show')
}
