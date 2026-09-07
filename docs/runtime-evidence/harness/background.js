chrome.tabs.onUpdated.addListener((id,change,tab)=>{if(change.status==='complete'&&tab.url?.startsWith('http://127.0.0.1:4174/'))chrome.tabs.setZoom(id,2)});
