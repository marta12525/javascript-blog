'use strict';
{
  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
  }

  function clearMessages (list) {
    list.innerHTML = '';
  }

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagSelector = '.post-tags a',
    optTagsListsSelector = '.list.tags a',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorsSelector = '.post .post-author',
    optAuthorSelector = '.post-author a',
    optAuthorsListsSelector = '.list.authors a',
    optTagsListSelector = '.tags.list',
    optAuthorsListSelector = '.authors.list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-';

  const titleClickHandler = function (event) {
    event.preventDefault ();
    const clickedElement = this;
  
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }  
  
    clickedElement.classList.add('active');

    const activeArticles = document.querySelectorAll('.posts article.active');

    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    const articleSelector = clickedElement.getAttribute('href');
  
    const correctArticle = document.querySelector(articleSelector);

    correctArticle.classList.add('active');

  };

  function generateTitleLinks (customSelector = '') {

    const titleList = document.querySelector(optTitleListSelector);

    clearMessages(titleList);

    const articles = document.querySelectorAll(optArticleSelector + customSelector);

    let html = '';

    for (let article of articles) {
      const articleId = article.getAttribute('id');

      const articleTitle = article.querySelector(optTitleSelector).innerHTML;

      const linkDataHTML = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkDataHTML);

      html += linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }

  }
  generateTitleLinks();

  function calculateTagsParams (tags) {
    const params = {
      max: 0,
      min: Number.MAX_SAFE_INTEGER
    }
    for (let tag in tags) {
      if (tags[tag] > params.max) {
        params.max = tags[tag];
      }
      if (tags[tag] < params.min) {
        params.min = tags[tag];
      }
    }
    return params;
  }

  function calculateTagClass (count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
    return classNumber;
  }

  function generateTags () {
    let allTags = {};

    const articles = document.querySelectorAll(optArticleSelector);
  
    for (let article of articles) {
  
      const tagsWrapper = article.querySelector(optArticleTagsSelector);
  
      let html = '';
  
      const articleTags = article.getAttribute('data-tags');
  
      const articleTagsArray = articleTags.split(' ');
  
      for (let tag of articleTagsArray) {
  
        const linkDataHTML = {id: tag};
        const linkHTML = templates.tagLink(linkDataHTML);
  
        html += linkHTML;

        if (!allTags[tag]) {
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
  
      }
  
      tagsWrapper.innerHTML = html;
  
    }

    const tagList = document.querySelector('.tags');

    const tagsParams = calculateTagsParams (allTags);

    const allTagsData = {tags: []};

    for (let tag in allTags) {
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }

    tagList.innerHTML = templates.tagCloudLink(allTagsData);

  }
  generateTags();

  function tagClickHandler (event) {
    event.preventDefault();
  
    const clickedElement = this;
  
    const href = clickedElement.getAttribute('href');
  
    const tag = href.replace('#tag-', '');
  
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  
    for (let activeTagLink of activeTagLinks) {
  
      activeTagLink.classList.remove('active');
  
    }
  
    const hrefTags = document.querySelectorAll('a[href^="#tag-' + tag + '"]');
  
    for (let hrefTag of hrefTags) {
  
      hrefTag.classList.add('active');
  
    }
  
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }
  
  function addClickListenersToTags () {
    const links = document.querySelectorAll(optArticleTagSelector + ',' + optTagsListsSelector);;
  
    for (let link of links) {
  
      link.addEventListener('click', tagClickHandler);
  
    }
  }
  
  addClickListenersToTags();

  function calculateAuthorsParams (authors) {
    const params = {
      max: 0,
      min: 999999,
    }
    for (let author in authors) {
      if (authors[author] > params.max) {
        params.max = authors[author];
      }
      if (authors[author] < params.min) {
        params.min = authors[author];
      }
    }
    return params;
  }

  function calculateAuthorsClass (count, params) {
    const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * optCloudClassCount + 1);
    return optCloudClassPrefix, classNumber;
  }
  
  function generateAuthors () {

    let allAuthors = {};
    
    const articles = document.querySelectorAll(optArticleSelector);

    for (let article of articles) {

      const authorsWrapper = article.querySelector(optArticleAuthorsSelector);

      let html = '';

      const articleAuthor = article.getAttribute('data-author');

      const articleAuthorInPost = articleAuthor.replace(/([A-Z])/g, ' $1');

      const linkDataHTML = {id: articleAuthor, name: articleAuthorInPost};
      const linkHTML = templates.authorLink(linkDataHTML);

      html += linkHTML;

      if (!allAuthors[articleAuthor]) {
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }

      authorsWrapper.innerHTML = html;

    }

    const authorsList = document.querySelector('.authors');

    const authorsParams = calculateAuthorsParams (allAuthors);

    const allAuthorsData = {authors: []};

    for (let singleAuthor in allAuthors) {

      allAuthorsData.authors.push({
        author: singleAuthor,
        count: allAuthors[singleAuthor],
        className: calculateAuthorsClass(allAuthors[singleAuthor], authorsParams)
      })

    }

    authorsList.innerHTML = templates.authorCloudLink(allAuthorsData);

  }
  generateAuthors ();

  function authorClickHandler (event) {

    event.preventDefault();

    const clickedElement = this;

    const href = clickedElement.getAttribute('href');

    const author = href.replace('#author-', '');

    const activeAuthorsLinks = document.querySelectorAll('a.active[href^="#author-"]');

    for (let activeAuthorsLink of activeAuthorsLinks) {

      activeAuthorsLink.classList.remove('active');
    }

    const hrefAuthors = document.querySelectorAll('a[href^="#author-' + author + '"]');

    for (let hrefAuthor of hrefAuthors) {

      hrefAuthor.classList.add('active');
    }

    generateTitleLinks('[data-author="' + author + '"]');

  }

  function addClickListenerToAuthors () {

    const links = document.querySelectorAll(optAuthorSelector + ' , ' + optAuthorsListsSelector);

    for (let link of links) {
      link.addEventListener('click', authorClickHandler);
    }
  }

  addClickListenerToAuthors();

}