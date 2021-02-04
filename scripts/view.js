var view = (function () {
  const pageInput = $("#pageInput");
  const $nextPageButton = $("#nextPageBtn");
  const $prevPageButton = $("#prevPageBtn");
  const $nextChapterButton = $("#nextChaptBtn");
  const $prevChapterButton = $("#prevChaptBtn");
  let codeSnippetsCounter = 0;

  function onReadyPage(callback) {
    let intervalId = window.setInterval(function () {
      if (document.getElementsByTagName("body")[0] !== undefined) {
        window.clearInterval(intervalId);
        if (callback) callback.call(this);
      }
    }, 1000);
  }

  function setVisible(selector, visible) {
    document.querySelector(selector).style.display = visible ? "block" : "none";
  }

  function createPages() {
    $(".nextPage")
      .not(":last")
      .each(function () {
        model.totalPageNumbers++;
        const $pageElement = $(
          `<br><span id="${util.createPageId(
            model.totalPageNumbers
          )}" class="page-number" tabindex="-1">Strona: ${
            model.totalPageNumbers
          }</span>`
        );
        $pageElement.insertAfter(this);
        model.documentPageElements.push($pageElement.get(0));
      });
    $(".nextPage").remove();
  }

  function createCopyButtons() {
    $("pre").each(function (index, element) {
      const codeSnippetId = `snippet-${codeSnippetsCounter}`;
      element.setAttribute("id", codeSnippetId);
      codeSnippetsCounter++;
      const $copyButton = $(`
            <button type="button" aria-label="Kopiuj kod źródłowy do schowka" class="copy-btn btn btn-dark btn-sm" data-clipboard-action="copy" data-clipboard-target="#${codeSnippetId}">
                Kopiuj kod źródłowy do schowka
            </button>`);
      $copyButton.insertAfter($(element).parent());
    });
  }

  function detectStructure() {
    let parent = model.documentRoot;
    $("h1").addClass("chap-0");
    $(":header:not(h1)").each(function () {
      let headerLevel = this.nodeName.substring(1);
      while (headerLevel <= parent.level && parent.parent) {
        parent = parent.parent;
      }

      if (headerLevel - parent.level === 1) {
        parent = _createNewNodeAndAddToParent(this, parent);
      } else if (headerLevel - parent.level === 0) {
        parent = _createNewNodeAndAddToParent(this, parent.parent);
      } else {
        console.warn("Not consistent document structure");
      }
    });
  }

  function createTableOfContent() {
    const $tableOfContents = $('<ul class="nav nav-pills flex-column"></ul>');

    addList(model.documentRoot.children, $tableOfContents);
    $("#tableOfContent").append($tableOfContents);

    function addList(nodeList, $parent) {
      for (const node of nodeList) {
        const $nodeTag = $(
          '<li class="nav-item"><a class="nav-link" href="#' +
            node.id +
            '">' +
            node.name +
            "</a></li>"
        );
        $parent.append($nodeTag);

        if (node.children && node.children.length > 0) {
          const $listElement = $("<li></li>");
          $parent.append($listElement);

          const $list = $('<ul class="nav nav-pills flex-column ml-3"></ul>');
          $listElement.append($list);
          addList(node.children, $list);
        }
      }
    }
  }

  function spyOnCurrentPage() {
    _updateCurrentPageState();
    _updatePageNavButtonsState();
    pageInput.val(model.currentPage);
    $(window).on("scroll", () => {
      _updateCurrentPageState();
      _updatePageNavButtonsState();
    });
  }

  function _updateCurrentPageState() {
    let current = 0,
      next = 1;
    let currentPage;
    while (!currentPage && next < model.documentPageElements.length) {
      const top = model.documentPageElements[current].getBoundingClientRect()
        .top;
      const bottom = model.documentPageElements[next].getBoundingClientRect()
        .top;
      if (top <= 1 && bottom >= 1) {
        currentPage = model.documentPageElements[current];
        break;
      }
      if (top > 5) {
        break;
      }
      current++;
      next++;
    }
    if (!currentPage && next == model.documentPageElements.length) {
      currentPage = model.documentPageElements[current];
    }
    if (currentPage && currentPage.id) {
      model.currentPage = _extractPageNumberFromId(currentPage.id);
      pageInput.val(model.currentPage);
    }
  }

  function _updatePageNavButtonsState() {
    const firstPage = model.documentPageElements[0];
    const lastPage =
      model.documentPageElements[model.documentPageElements.length - 1];
    _checkPageNavButtonState(firstPage, $prevPageButton);
    _checkPageNavButtonState(lastPage, $nextPageButton);
  }

  function _checkPageNavButtonState(pageNumberElement, $pageButton) {
    if (!pageNumberElement) {
      return;
    }
    if (_isInViewport(pageNumberElement)) {
      $pageButton.addClass("disabled");
    } else {
      $pageButton.removeClass("disabled");
    }
  }

  function _isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  function spyOnCurrentChapter() {
    $("body").scrollspy({ target: "#tableOfContent", offset: 10 });
    $(window).on("activate.bs.scrollspy", function (event, target) {
      model.currentChapterId = target.relatedTarget.replace("#", "");
      const navbar = [...document.getElementsByClassName("tfl-side-navbar")][0];
      const activeLinks = [
        ...document.getElementsByClassName("nav-link active"),
      ];
      if (activeLinks.length > 0) {
        navbar.scrollTop = activeLinks[activeLinks.length - 1].offsetTop;
      }
    });
    _updateChapterButtonState();
    $(window).on("scroll", _updateChapterButtonState);
  }

  function _updateChapterButtonState() {
    const firstChapterNode = model.documentStructure[1]; //because 0 element is root
    const lastChapterNode =
      model.documentStructure[model.documentStructure.length - 1];

    if (model.currentChapterId !== "") {
      _checkChapterNavButtonState(firstChapterNode, $prevChapterButton);
    } else {
      $prevChapterButton.addClass("disabled");
    }
    _checkChapterNavButtonState(lastChapterNode, $nextChapterButton);
  }

  function _checkChapterNavButtonState(chapterNodeToCheck, $pageButton) {
    if (
      model.currentChapterId === chapterNodeToCheck.id ||
      _isInViewport(chapterNodeToCheck.element)
    ) {
      $pageButton.addClass("disabled");
    } else {
      $pageButton.removeClass("disabled");
    }
  }

  function createTooltips() {
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  function _extractPageNumberFromId(pageId) {
    return +pageId.substr(pageId.indexOf("-") + 1);
  }

  function _createNewNodeAndAddToParent(currentElement, parent) {
    const parentId = parent.id || "chap";
    let nodeId = parentId + "-" + (parent.children.length + 1);
    currentElement.id = nodeId;
    currentElement.setAttribute("tabindex", "-1");
    const newNode = new DocumentNode(
      nodeId,
      +currentElement.nodeName.substring(1),
      currentElement.innerText,
      parent,
      currentElement
    );
    parent.children.push(newNode);
    model.documentStructure.push(newNode);
    return newNode;
  }

  function renderTree() {
    const treeGroup = $(".tfl-deque-tree-no-select");
    for (let i = 0; i < treeGroup.length; i++) {
      deque.createTree({ selectStyle: "" }, treeGroup[i]);
    }
  }

  return {
    /**
     * Animation on load html page
     */
    onReadyPage,
    /**
     * Enable and disable visible element on website
     */
    setVisible,
    /**
     * Split document into pages based on hr element
     */
    createPages,
    /**
     * Detects document structure based on headers in the document
     */
    detectStructure,
    /**
     * Creates table of content based on document structure
     */
    createTableOfContent,
    /**
     * Spies on the page currently in the view. Keeps current page in the model and in the input element up to date.
     */
    spyOnCurrentPage,
    /**
     * Spies on the chapter currently in the view. Keeps table of content link active and current chapter in the model up to date
     */
    spyOnCurrentChapter,
    /**
     * Creates tooltips
     */
    createTooltips,
    /**
     * Creates copy buttons for code snipets
     */
    createCopyButtons,
    /**
     * Creating a graph representation structure
     */
    renderTree
  };
})();
