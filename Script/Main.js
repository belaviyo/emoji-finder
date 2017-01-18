/* globals MenuSpy */
'use strict';

/* -------------------------------------------------- Begin Search Section ------------------------------------*/
var cache = [], recentItems = [];
var lblEmojiName = document.getElementById('lblEmojiName');
var main = document.getElementsByTagName('main')[0];
var footerPreview = document.getElementById('footerPreview');
var lastActiveNode = document.getElementById('recentNode');
var recentListContent = document.getElementById('recentListContent');
var optionPage = document.getElementById('optionPage');
var btnCopy = document.getElementById('btnCopy');
var maxRecentCounter = null;
var recentCounter = 0;

optionPage.addEventListener('click', function () {
  chrome.runtime.openOptionsPage();
});

btnCopy.addEventListener('click', function () {
  var copyFrom = document.createElement('textarea');
  copyFrom.textContent = footerPreview.innerHTML;
  document.body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  copyFrom.remove();
});

document.addEventListener('DOMContentLoaded', function () {
  window.setTimeout(function () {
    [...document.querySelectorAll('template')].forEach(function (template) {
      template.parentNode.appendChild(document.importNode(template.content, true));
    });

    window.setTimeout(function () {
      var emojiList = main.getElementsByTagName('a');
      for (var i = 0; i < emojiList.length; i++) {
        cache.push({
          element: emojiList[i],
          title: emojiList[i].getAttribute('title').toLowerCase(),
          keywords: emojiList[i].getAttribute('data-keywords').toLowerCase()
        });
      }
    }, 1000);

    // load additional scripts
    var spy = document.getElementById('menuspy');
    spy.addEventListener('load', function () {
      var elm = document.querySelector('#aside');
      new MenuSpy(elm);
    });
    spy.src = 'Script/menuspy.js';
  }, 200);

  chrome.storage.local.get({
    'MaxRecentCounter': 10,
    'FontSize': 'xx-large',
    'RecentlyListItem': []
  }, function (result) {
    maxRecentCounter = result.MaxRecentCounter;
    document.body.dataset.size = result.FontSize;

    recentListContent.textContent = '';
    recentCounter = result.RecentlyListItem.length;
    for (var i = 0; i < result.RecentlyListItem.length; i++) {
      recentListContent.innerHTML += '<li>' + (result.RecentlyListItem[i].element) + '</li>';
      recentItems.push({
        element: result.RecentlyListItem[i].element
      });
    }
  });

  document.getElementById('zenscroll').src = 'Script/zenscroll-min.js';
});

document.getElementById('txtSearch').addEventListener('input', function () {
  var query = this.value.trim().toLowerCase();
  cache.forEach(function (e) {
    var index = 0;
    var index2 = 0;
    if (query) {
      index = e.keywords.indexOf(query);
      index2 = e.title.indexOf(query);
    }

    e.element.parentElement.style.display = index === -1 && index2 === -1 ? 'none' : '';
  });
});

main.addEventListener('mouseover', function (e) {
  var target = e.target;
  if (target.nodeName.toLowerCase() === 'a') {
    lblEmojiName.textContent = target.getAttribute('title') + ' ( ' + target.getAttribute('id') + ' )';
  }
});
main.addEventListener('click', function (e) {
  if (e.target.nodeName.toLowerCase() === 'a') {
    footerPreview.focus();
    document.execCommand('insertHTML', false, '&#x' + e.target.getAttribute('id') + ';');
    footerPreview.blur();
  }
});

document.addEventListener('click', function (e) {
  if (e.target.id === 'btnClearEmojiPreview') {
    footerPreview.innerHTML = '';
  }

  if (e.target.parentNode.parentNode.parentNode.nodeName.toLowerCase() === 'aside') {
    lastActiveNode = e.target.parentNode;
  }

  if (e.target.parentNode.parentNode.className === 'emoji-list-content') {
    if (recentCounter < maxRecentCounter) {
      recentCounter++;
      recentListContent.appendChild(e.target.parentNode.cloneNode(true));
      recentItems.push({
        element: e.target.parentElement.innerHTML
      });
      chrome.storage.local.set({
        'RecentlyListItem': recentItems
      });
    }
    else {
      recentItems.splice(0, 1);
      recentListContent.appendChild(e.target.parentNode.cloneNode(true));
      recentListContent.childNodes[0].remove();
      recentItems.push({
        element: e.target.parentElement.innerHTML
      });
      chrome.storage.local.set({
        'RecentlyListItem': recentItems
      });
    }
  }
});

