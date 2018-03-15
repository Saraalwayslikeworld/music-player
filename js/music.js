
function getMusic(callback){
    var xhr = new XMLHttpRequest()
    xhr.open('GET','../music-player/music.json',true)
    xhr.send()
    xhr.onload = function(req,res){
        if((xhr.status>=200 && xhr.status<300)||xhr.status===304){
            callback(JSON.parse(this.responseText))
        }else{
            res.end('<h1>服务器出错</h1>')
        }
    }
    xhr.onerror = function(){
        console.log('error')
    }
}

getMusic(function(list){
    var song = list[0]
    var audioObject = new audioObject(song.src)
    play(audioObject)
})