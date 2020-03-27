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

  function generateTitleLinks (customSelector = '') {

    const titleList = document.querySelector(optTitleListSelector);

    clearMessages(titleList);

    const articles = document.querySelectorAll(optArticleSelector + customSelector);

    let html = '';

    for (let article of articles) {
      const articleId = article.getAttribute('id');

      const articleTitle = article.querySelector(optTitleSelector).innerHTML;

      //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
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
      min: Number.MAX_SAFE_INTEGER + 1
      //min: 999999,
    }
    for (let tag in tags) {
      if (tags[tag] > params.max) {
        params.max = tags[tag];
      }
      if (tags[tag] < params.min) {
        params.min = tags[tag];
      }
      console.log(tag + ' is used ' + tags[tag] + ' times');
    }
    return params;
  }

  function calculateTagClass (count, params) {
    //const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * optCloudClassCount + 1 );
    //return optCloudClassPrefix, classNumber;
    //console.log('calculateTagClass:', calculateTagClass, 'count:' ,count, 'params:', params);
    const normalizedCount = count - params.min;
    //console.log('normalizedCount:', normalizedCount);
    const normalizedMax = params.max - params.min;
    //console.log('normalizedMax:', normalizedMax);
    const percentage = normalizedCount / normalizedMax;
    //console.log('percentage:', percentage);
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
    //console.log('classNumber:', classNumber);
    return classNumber;
  }

  function generateTags(){
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};

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
        //let linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
        const linkDataHTML = {id: tag};
        const linkHTML = templates.tagLink(linkDataHTML);
  
        /* add generated code to html variable */
        html += linkHTML;

        /* [NEW] check if this link is NOT already in allTags */
        if (!allTags[tag]) {
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
  
      /* END LOOP: for each tag */
      }
  
      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;
  
    /* END LOOP: for every article: */
    }

    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector('.tags');

    const tagsParams = calculateTagsParams (allTags);
    console.log('tagsParams:', tagsParams);

    //let allTagsHTML = '';
    const allTagsData = {tags: []};

    for (let tag in allTags) {
      //const tagLinkHTML = '<li><a class="tag-size-' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag +'</a>(' + allTags[tag] + ')</li>';
      //allTagsHTML += tagLinkHTML;
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }

    //tagList.innerHTML = allTagsHTML;
    tagList.innerHTML = templates.tagCloudLink(allTagsData);

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
    const hrefTags = document.querySelectorAll('a[href^="#tag-' + tag + '"]');
  
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
    const links = document.querySelectorAll(optArticleTagSelector + ',' + optTagsListsSelector);;
  
    /* START LOOP: for each link */
    for (let link of links) {
  
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
  
    /* END LOOP: for each link */
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
      console.log(author + ' is used ' + authors[author] + ' times');
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

      //const linkHTML = '<a href="#author-' + articleAuthor + '">by ' + articleAuthorInPost + '</a>';
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
    console.log('authorsParams', authorsParams);

    //let allAuthorsHTML = '';
    const allAuthorsData = {authors: []};

    for (let singleAuthor in allAuthors) {
      //allAuthorsHTML += '<li><a class="author-size-' + calculateAuthorsClass(allAuthors[singleAuthor], authorsParams) + '" href="#author-' + singleAuthor + '">' + singleAuthor + '</a>(' + allAuthors[singleAuthor] + ')</li>';

      allAuthorsData.authors.push({
        author: singleAuthor,
        count: allAuthors[singleAuthor],
        className: calculateAuthorsClass(allAuthors[singleAuthor], authorsParams)
      })

    }

    //authorsList.innerHTML = allAuthorsHTML;
    authorsList.innerHTML = templates.authorCloudLink(allAuthorsData);

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