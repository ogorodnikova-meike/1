var randomStr="qazxswedcvfrtgbnhyujmkiolpQWERTYUIOPLKJHGFDSAZXCVBNM0192837645",randomId=1,bookArray=getParams("book_id").split(","),LAN_EN=2,LAN_JP=3,LAN_KA=4,sessionId=guid(),seqId=0,operationStack=[],readWords=0,dotIndex=-1,readComplete=!1,bookContentHeight=-1,bookContentWidth=-1,bookContentPercent=0,bookContentPercentMax=0,pageLiveTime=0,bookContentDOM=null,bookDetailContentDOM=null,wordsDotDom=[],wordsDotOffsetArr=[],timer=null,clientHeight=100,baseUrl="",newRemoteUploadUrl="",newRemoteUploadUrl=window.location.href?window.location.origin.replace("cdn","us"):"https://us.readictnovel.com";newRemoteUploadUrl="https://us.readictnovel.com";var bookInfo={name:"",auther:"",category:"",desc:"",title:"",detail_content:"",img:""},bookId=bookArray[Math.floor(Math.random()*bookArray.length)],activity_name=getParams("source"),planId=parseInt(getParams("plan_id")),domReady=!1,updateDom=!1,cols=parseInt((document.body.clientWidth-25.6)/18),init_words=0,accuracy=1e3;function readNow(){novelRecord("readNow"),document.getElementById("pop").style.display="none",updateDom||(document.getElementById("loading").style.display="block")}function backNative(){document.getElementById("pop").style.display="none",window.CTKJavaScriptHandler.closeWebView&&window.CTKJavaScriptHandler.closeWebView(),novelRecord("closePage")}function init(){novelRecord("h5_open",""),pageStartTime=Date.now(),pageLiveTime=Date.now(),window.onunload=function(){pageLiveTime=Date.now()-pageLiveTime,pageLiveTime=Math.floor(pageLiveTime/1e3),novelRecord("h5_exit","")},timer=setInterval(function(){pageDuration=Date.now()-pageStartTime,pageDuration=Math.floor(pageDuration/1e3),novelRecord("interval_5s",pageDuration)},5e3),getBookInfo(),getChapterInfo()}function submitEmail(){var emailInputDom=document.getElementById("email-tips-input");emailInputDom&&(novelRecord("user_email",emailInputDom.value),Toast("Submitted successfully!",2e3))}function getBookInfo(){var startReq=(new Date).getTime();ajax({method:"get",url:"/api/h5-content/book",data:{book_id:bookId},success:function(res){var endReq=(new Date).getTime()-startReq;recordTime("fetchNovelInfo",endReq,"interface"),res=res.res_data,bookInfo.name=res.title,bookInfo.auther=res.author,bookInfo.category=res.classification.join(","),bookInfo.img=res.cover_image_url,bookInfo.desc=res.description,bookInfo.language=res.language,domReady?insertDom():window.onload=function(){domReady=!0,insertDom()}}},newRemoteUploadUrl)}function getChapterInfo(){var startReq=(new Date).getTime();ajax({method:"get",url:"/api/h5-content/book/chapter",data:{book_id:bookId,chapter_index:1,chapter_count:50},success:function(res){var endReq=(new Date).getTime()-startReq;recordTime("fetchNovelChapter",endReq,"interface"),initChapterRecord(res.res_data.length),res.res_data.length||novelRecordFail("fetch_empty_content");var content="";res.res_data.map(function(item,index){content=content+'<span class="wordsDot" id="chapter__'+item.chapter_index+'"></span><span class="title">'+item.chapter_title+"</span>\n"+item.chapter_content}),bookInfo.title=res.res_data[0].chapter_title,bookInfo.detail_content=content,domReady?insertDom():window.onload=function(){domReady=!0,insertDom()}}},newRemoteUploadUrl)}function insertDom(){updateDom=!0;var inserContent=contentInsertDom;switch(bookInfo.language){case LAN_JP:headerInfo={intro:"小説の概要:",points:"★",tips:"書籍の90％より優れた評価",rank:"ランキング",reading:"人のフォロワー"},document.getElementsByClassName("book-detail-content")[0].style.fontSize="14px",document.getElementsByClassName("book-detail-content")[0].style.lineHeight="1.5em",inserContent=contentAsianInsertDom;break;case LAN_KA:headerInfo={intro:"작품 소개:",points:"평점",tips:"책의 90 % 이상",rank:"베스트지수",reading:"조회수"},document.getElementsByClassName("book-detail-content")[0].style.fontSize="17px",document.getElementsByClassName("book-detail-content")[0].style.lineHeight="1.5em",inserContent=contentAsianInsertDom}document.getElementsByClassName("book-title")[0].innerHTML=bookInfo.name,document.getElementsByClassName("book-auther")[0].innerHTML=bookInfo.auther,document.getElementsByClassName("book-categery")[0].innerHTML=bookInfo.category,document.getElementsByClassName("book-detail-content")[0].innerHTML=inserContent(bookInfo.detail_content),document.getElementsByClassName("bookInfo-img")[0].src=bookInfo.img,document.getElementsByClassName("book-cover-background")[0].src=bookInfo.img,bookContentDOM=document.getElementById("content"),bookInfoContainerDOM=document.getElementsByClassName("info-container")[0],bookDetailContentDOM=document.getElementsByClassName("book-content")[0],document.getElementById("loading").style.display="none",watchScroll(),generateWordsOffsetTop(wordsDotDom=document.getElementsByClassName("wordsDot")),initChapterHeight()}function contentInsertDom(str,length){for(var wordEffectiveIndex=0,wordSplitArr=str.split(" "),i=0;i<wordSplitArr.length;i++)!wordSplitArr[i]||wordSplitArr[i].trim&&""==wordSplitArr[i].trim()||" "==wordSplitArr[i]||"\n"==wordSplitArr[i]||"↵"==wordSplitArr[i]||-1!="".indexOf(wordSplitArr[i])||(++wordEffectiveIndex%1e3==0&&wordSplitArr.splice(i+wordEffectiveIndex/1e3,0,"<span class='wordsDot' id='read_words__"+wordEffectiveIndex+"'></span>"),wordEffectiveIndex<1e3&&(200==wordEffectiveIndex||500==wordEffectiveIndex||700==wordEffectiveIndex)&&wordSplitArr.splice(i+wordEffectiveIndex/100,0,"<span class='wordsDot' id='read_words__"+wordEffectiveIndex+"'></span>"));var wordSplitStr=wordSplitArr.join(" ");return wordSplitStr=(wordSplitStr=wordSplitStr.replace(/\n/g,"<br/><br/>")).replace(/↵/g,"<br/><br/>")}function contentAsianInsertDom(str,length){for(var wordEffectiveIndex=0,symbolCollection="……，。！？、；：“”‘’,.!?/'\"<>\\:;",wordSplitArr=str.split(""),i=0;i<wordSplitArr.length;i++)!wordSplitArr[i]||wordSplitArr[i].trim&&""==wordSplitArr[i].trim()||" "==wordSplitArr[i]||"\n"==wordSplitArr[i]||"↵"==wordSplitArr[i]||-1!=symbolCollection.indexOf(wordSplitArr[i])||(++wordEffectiveIndex%1e3==0&&wordSplitArr.splice(i+wordEffectiveIndex/1e3,0,"<span class='wordsDot' id='read_words__"+wordEffectiveIndex+"'></span>"),wordEffectiveIndex<1e3&&(200==wordEffectiveIndex||500==wordEffectiveIndex||700==wordEffectiveIndex)&&wordSplitArr.splice(i+wordEffectiveIndex/100,0,"<span class='wordsDot' id='read_words__"+wordEffectiveIndex+"'></span>"));var wordSplitStr=wordSplitArr.join("");return wordSplitStr=(wordSplitStr=wordSplitStr.replace(/\n/g,"<br/><br/>")).replace(/↵/g,"<br/><br/>")}function generateWordsOffsetTop(Dotdom){for(var i=0;i<Dotdom.length;i++){Dotdom[i].id;var dotEvent=Dotdom[i].id.split("__")[0],dotWords=parseInt(Dotdom[i].id.split("__")[1]);wordsDotOffsetArr.push({event:dotEvent,words:dotWords,offsetTop:Dotdom[i].offsetTop})}}function watchScroll(){bookContentDOM.onscroll=null;bookContentDOM.onscroll=function(){-1==bookContentHeight&&(bookContentHeight=bookContentDOM.scrollHeight);var words=parseInt((bookContentDOM.clientHeight+bookContentDOM.scrollTop-295-65)/28*cols);init_words+accuracy<words&&init_words+accuracy<words&&(init_words+=accuracy);var contentDOMScrollTop=bookContentDOM.scrollTop,contentDOMClientHeight=bookContentDOM.clientHeight;if(bookInfoContainerDOM.offsetHeight+bookDetailContentDOM.clientHeight-contentDOMClientHeight-contentDOMScrollTop<0&&!readComplete&&-1<operationStack.indexOf("read_words_200")){readComplete=!0,novelRecord("read_finish","");for(var i=0;i<wordsDotOffsetArr.length;i++){novelRecord(wordsDotOffsetArr[i].event,wordsDotOffsetArr[i].words)}}for(var srollInstance=parseInt(bookContentDOM.scrollTop+bookContentDOM.clientHeight-340),currentReadEvent=null,currentReadWords=0,i=0;i<wordsDotOffsetArr.length;i++)i<wordsDotOffsetArr.length-1?srollInstance>wordsDotOffsetArr[i].offsetTop&&srollInstance<wordsDotOffsetArr[i+1].offsetTop&&(currentDotIndex=i,currentReadEvent=wordsDotOffsetArr[i].event,currentReadWords=wordsDotOffsetArr[i].words):srollInstance>wordsDotOffsetArr[i].offsetTop&&(currentDotIndex=i,currentReadEvent=wordsDotOffsetArr[i].event,currentReadWords=wordsDotOffsetArr[i].words);if(currentReadEvent&&readWords<currentReadWords){if(1<currentDotIndex-dotIndex){currentDotIndex;for(var j=dotIndex+1;j<currentDotIndex;j++){novelRecord(wordsDotOffsetArr[j].event,wordsDotOffsetArr[j].words)}}dotIndex=currentDotIndex,novelRecord(currentReadEvent,readWords=currentReadWords)}gaChapterProgress(),gaChapterReadingEnter()}}function novelRecord(event,value,i){value=value||"";var eventValue=event?event.toString()+"_"+value:"";3<i||(1==i&&seqId++,-1===operationStack.indexOf(eventValue)&&ajax({method:"post",url:"/book/data",data:{session_id:sessionId,seq_id:parseInt(seqId),plan_id:planId,source:"US",book_id:parseInt(bookId),event:event,value:value.toString()},success:function(res){event&&-1==eventValue.indexOf("interval_5s")&&-1==operationStack.indexOf(eventValue)&&operationStack.push(eventValue)},error:function(e){-1==eventValue.indexOf("interval_5s")&&(novelRecordFail("report_failed"),setTimeout(function(){novelRecord(event,value,i+1)},5e3))}},newRemoteUploadUrl))}function novelRecordFail(event,value){seqId++,ajax({method:"post",url:"/book/data",data:{session_id:sessionId,seq_id:parseInt(seqId),plan_id:planId,source:"US",book_id:parseInt(bookId),event:event,value:value}},newRemoteUploadUrl)}function toData(obj){if(null==obj)return obj;var arr=[];for(var i in obj){var str=i+"="+obj[i];arr.push(str)}return arr.join("&")}function getParams(k){for(var obj={},params=window.location.search.split("?")[1]&&window.location.search.split("?")[1].split("&"),i=0;i<params.length;i++){var arr=params[i].split("=");1<arr.length&&(obj[arr[0]]=arr[1])}return k in obj?obj[k]:""}function ajax(obj,remoteUrl){var ajax;obj.method=obj.method||"get",obj.data=obj.data||null,obj.async=obj.async||!0,ajax=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"),obj.url=(remoteUrl||baseUrl)+obj.url,"post"==obj.method?(ajax.open(obj.method,obj.url,obj.async),ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),obj.data?ajax.send(JSON.stringify(obj.data)):ajax.send()):(obj.url=toData(obj.data)?obj.url+"?"+toData(obj.data):obj.url,ajax.open(obj.method,obj.url,obj.async),ajax.send()),ajax.onreadystatechange=function(){if(4==ajax.readyState)if(200<=ajax.status&&ajax.status<300||304==ajax.status){if(obj.success){var response=JSON.parse(ajax.responseText);if(-1<obj.url.indexOf("/api/h5-content/book?")?record("interfacet","fetchNovelInfo",response.result_code,""):-1<obj.url.indexOf("/api/h5-content/book/chapter?")&&record("interfacet","fetchNovelChapter",response.result_code,""),2e3!=response.result_code)throw obj.error&&obj.error(response.result_code),new Error("请求错误，请重试"+response.result_code);obj.success(response.result)}}else obj.error&&(obj.error(ajax.status),"/api/h5-content/book"===obj.url?(record("interfacet","fetchNovelInfo","Request_error",""),novelRecordFail("fetch_novel_Info_error")):"/api/h5-content/book/chapter"===obj.url&&(record("interfacet","fetchNovelChapter","Request_error",""),novelRecordFail("fetch_novel_content_error")))}}function guid(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c){var r=16*Math.random()|0;return("x"==c?r:3&r|8).toString(16)})}function Toast(msg,duration){duration=isNaN(duration)?3e3:duration;var m=document.createElement("div");m.innerHTML=msg,m.className="confirm-toast-box",document.body.appendChild(m),setTimeout(function(){m.style.webkitTransition="-webkit-transform 0.5s ease-in, opacity 0.5s ease-in",m.style.opacity="0",setTimeout(function(){document.body.removeChild(m)},500)},duration)}init(),window.onload=function(){domReady=!0};