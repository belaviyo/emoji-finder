
var recentNumberActiveList = document.getElementsByClassName('recentNumberList-active');
var fontOptionaActiveList = document.getElementsByClassName('fontOptionList-active');

for (var i = 0; i < recentNumberActiveList.length; i++) {
    recentNumberActiveList[i].classList.remove('recentNumberList-active');
}
var NoneOption = document.getElementById('NoneOption');
var defultRecentItem = document.getElementById('defultRecentItem');
var TwentyOption = document.getElementById('TwentyOption');
var ThirtyOption = document.getElementById('ThirtyOption');
var FortyOption = document.getElementById('FortyOption');
var FiftyOption = document.getElementById('FiftyOption');



chrome.storage.local.get('MaxRecentCounter', function (result) {
    if (result.MaxRecentCounter != undefined) {
        if (result.MaxRecentCounter == 'NONE')
            NoneOption.className += " recentNumberList-active";
        if (result.MaxRecentCounter == 10)
            defultRecentItem.className += " recentNumberList-active";
        if (result.MaxRecentCounter == 20)
            TwentyOption.className += " recentNumberList-active";
        if (result.MaxRecentCounter == 30)
            ThirtyOption.className += " recentNumberList-active";
        if (result.MaxRecentCounter == 40)
            FortyOption.className += " recentNumberList-active";
        if (result.MaxRecentCounter == 50)
            FiftyOption.className += " recentNumberList-active";
    }
});

chrome.storage.local.get('FontSize', function (result) {
    if (result.FontSize != undefined) {
        fontOptionaActiveList = document.getElementsByClassName('fontOptionList-active');
        for (var i = 0; i < fontOptionaActiveList.length; i++) {
            fontOptionaActiveList[i].classList.remove('fontOptionList-active');
        }
        if (result.FontSize == 'large')
            document.getElementById('SmallSize').className += " fontOptionList-active";
        if (result.FontSize == 'x-large')
            document.getElementById('NormalSize').className += " fontOptionList-active";
        if (result.FontSize == 'xx-large')
            document.getElementById('LargeSize').className += " fontOptionList-active";
    }
});
document.addEventListener('click', function (e) {
    if (e.target.parentNode.id == 'recentOption')
    {
        recentNumberActiveList = document.getElementsByClassName('recentNumberList-active');
        for (var i = 0; i < recentNumberActiveList.length; i++) {
            recentNumberActiveList[i].classList.remove('recentNumberList-active');
        }
        e.target.className += ' recentNumberList-active';
       

        if(e.target.innerText!="NONE")
            chrome.storage.local.set({ 'MaxRecentCounter': e.target.innerText });
        else
            chrome.storage.local.set({ 'MaxRecentCounter': 999 });

        chrome.storage.local.remove('RecentlyListItem', function () {
            var error = chrome.runtime.lastError;
            if (error)
                console.error(error);
        });
    }
    else if (e.target.parentNode.id == 'fontOption')
    {
        fontOptionaActiveList = document.getElementsByClassName('fontOptionList-active');
        for (var i = 0; i < fontOptionaActiveList.length; i++) {
            fontOptionaActiveList[i].classList.remove('fontOptionList-active');
        }
        e.target.className += ' fontOptionList-active';

        if (e.target.innerText == 'SMALL')
            chrome.storage.local.set({ 'FontSize': 'large' });
        else if(e.target.innerText=='NORMAL')
            chrome.storage.local.set({ 'FontSize': 'x-large' });
        else if(e.target.innerText=='LARGE')
            chrome.storage.local.set({ 'FontSize': 'xx-large' });
    }
});