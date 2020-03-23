'use strict';
{
  function clearMessages (list) {
    list.innerHTML = '';
  }

  const titleClickHandler = function (event) {
    event.preventDefault();
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

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorsSelector = '.post .post-author',
    optAuthorSelector = '.post-author';

  function generateTitleLinks (customSelector = '') {

    const titleList = document.querySelector(optTitleListSelector);

    clearMessages(titleList);

    const articles = document.querySelectorAll(optArticleSelector + customSelector);

    let html = '';

    for (let article of articles) {
      const articleId = article.getAttribute('id');

      const articleTitle = article.querySelector(optTitleSelector).innerHTML;

      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

      html = html + linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }

  }
  generateTitleLinks();

  function generateTags(){
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
  
    /* START LOOP: for every article: */
    for (let article of articles) {
  
      /* find tags wrapper */
      const tagsWrapper = article.querySelector(optArticleTagsSelector);
  
      /* make html variable with empty string */
      let html = '';
  
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
  
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
  
      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {
  
        /* generate HTML of the link */
        let linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
  
        /* add generated code to html variable */
        html = html + linkHTML;
  
      /* END LOOP: for each tag */
      }
  
      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;
  
    /* END LOOP: for every article: */
    }

  }
  generateTags();

  function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
  
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
  
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
  
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
  
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  
    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks) {
  
      /* remove class active */
      activeTagLink.classList.remove('active');
  
    /* END LOOP: for each active tag link */
    }
  
    /* find all tag links with "href" attribute equal to the "href" constant */
    const hrefTags = document.querySelectorAll('a[href="' + href + '"]');
  
    /* START LOOP: for each found tag link */
    for (let hrefTag of hrefTags) {
  
      /* add class active */
      hrefTag.classList.add('active');
  
    /* END LOOP: for each found tag link */
    }
  
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }
  
  function addClickListenersToTags() {
    /* find all links to tags */
    const links = document.querySelectorAll('.post-tags .list a');
  
    /* START LOOP: for each link */
    for (let link of links) {
  
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
  
    /* END LOOP: for each link */
    }
  }
  
  addClickListenersToTags();

  function generateAuthors () {
    
    const articles = document.querySelectorAll(optArticleSelector);

    for (let article of articles) {

      const authorsWrapper = article.querySelector(optArticleAuthorsSelector);

      let html = '';

      const articleAuthor = article.getAttribute('data-author');

      const articleAuthorInPost = articleAuthor.replace(/([A-Z])/g, ' $1');

      const linkHTML = '<a href="#author-' + articleAuthor + '">by ' + articleAuthorInPost + '</a>';

      html = html + linkHTML;

      authorsWrapper.innerHTML = html;

    }

  }
  generateAuthors ();

  function authorClickHandler(event) {

    event.preventDefault();

    const clickedElement = this;

    const href = clickedElement.getAttribute('href');
    console.log(href);

    const author = href.replace('#author-', '');
    console.log(author);

    const activeAuthorsLinks = document.querySelectorAll('a.active[href^="#author-"]');

    for (let activeAuthorsLink of activeAuthorsLinks) {

      activeAuthorsLink.classList.remove('active');
    }

    const hrefAuthors = document.querySelectorAll('a[href="' + href + '"]');

    for (let hrefAuthor of hrefAuthors) {

      hrefAuthor.classList.add('active');
    }

    generateTitleLinks('[data-author="' + author + '"]');

  }

  function addClickListenerToAuthors () {

    const links = document.querySelectorAll('.post .post-author a');

    for (let link of links) {
      link.addEventListener('click', authorClickHandler);
    }
  }

  addClickListenerToAuthors();

}