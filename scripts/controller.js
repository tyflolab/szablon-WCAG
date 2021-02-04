/**
 * Controller handles all user interactions;
 */
var ctrl = (function () {
  function navigateToPage() {
    event.preventDefault();
    const form = {};
    $("#goToPageForm")
      .serializeArray()
      .forEach((element) => {
        form[element.name] = element.value;
      });
    if (Util.isNotValidPageNumber(form.pageInput)) {
      alert("Brak podanego numeru strony w publikacji");
      return;
    }
    _navigateToPage(form.pageInput);
  }
  var Util = {
    isNotValidPageNumber: function (pageNumber) {
      return (
        !Number.isInteger(+pageNumber) ||
        +pageNumber > model.totalPageNumbers ||
        +pageNumber < 1
      );
    },
  };

  function navigateToNextPage() {
    _navigateToPage(parseInt(model.currentPage) + 1);
  }

  function navigateToPrevPage() {
    _navigateToPage(parseInt(model.currentPage) - 1);
  }

  function navigateToNextChapter() {
    _navigateToChapterWithOffset(1);
  }

  function navigateToPrevChapter() {
    _navigateToChapterWithOffset(-1);
  }

  function _navigateToChapterWithOffset(offset) {
    const currentChapterIndex = model.getChapterIndexById(
      model.currentChapterId
    );
    if (currentChapterIndex < 0) {
      console.error("Current chapter cannot be found in document structure");
      return;
    }
    const targetChapterNode =
      model.documentStructure[currentChapterIndex + offset];
    if (!targetChapterNode || targetChapterNode.name === "root") {
      alert("Nie ma więcej rozdziałów");
      return;
    }
    const targetElement = document.getElementById(targetChapterNode.id);
    targetElement.scrollIntoView();
    targetElement.focus();
    model.currentChapterId = targetChapterNode.id;
  }

  function _navigateToPage(targetPageNumber) {
    if (_isNotValidPageNumber(targetPageNumber)) {
      alert("Nie ma więcej stron");
      return;
    }
    const targetElement = document.getElementById(
      util.createPageId(targetPageNumber)
    );
    targetElement.scrollIntoView();
    targetElement.focus();
    model.currentPage = targetPageNumber;
  }

  function _isNotValidPageNumber(pageNumber) {
    return (
      !Number.isInteger(+pageNumber) ||
      +pageNumber > model.totalPageNumbers ||
      +pageNumber < 1
    );
  }

  function changeLoadedConfiguration() {
    if (sessionStorage.getItem("configurationKeyBLoaded") == "false") {
      sessionStorage.setItem("configurationKeyPLoaded", false);

      if (sessionStorage.getItem("loadConfiguration") == "true") {
        location.reload();
      }

      MathJax = {
        loader: { load: ["input/tex", "ui/menu"] },
        startup: {
          pageReady: () => {
            return MathJax.startup.defaultPageReady().then(() => {
              MathJax.startup.document.menu.menu
                .findID("Accessibility", "AssistiveMml")
                .disable();
              MathJax._.mathjax.mathjax.handleRetriesFor(() =>
                MathJax.startup.document.render()
              );
            });
          },
        },

        tex: {
          inlineMath: {
            "[+]": [["$", "$"]],
          },
        },
        options: {
          menuOptions: {
            settings: {
              assistiveMml: false,
            },
          },
          renderActions: {
            assistiveMml: [],
            typeset: [
              150,
              (doc) => {
                for (math of doc.math) {
                  MathJax.config.renderMathML(math, doc);
                }
                view.setVisible(".container-spinner", false);
                view.setVisible(".container-fluid", true);
              },
              (math, doc) => MathJax.config.renderMathML(math, doc),
            ],
          },
        },
        renderMathML(math, doc) {
          math.typesetRoot = document.createElement("mjx-container");
          math.typesetRoot.innerHTML = MathJax.startup.toMML(math.root);
          math.display && math.typesetRoot.setAttribute("display", "block");
        },
      };

      if (sessionStorage.getItem("configurationKeyBLoaded") == "false") {
        let scriptTag = document.createElement("script");
        scriptTag.type = "text/javascript";
        scriptTag.defer = true;
        scriptTag.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/startup.js";
        scriptTag.id = "MathJax-script";
        (
          document.getElementsByTagName("head")[0] || document.documentElement
        ).appendChild(scriptTag);
      }

      sessionStorage.setItem("loadConfiguration", true);
      sessionStorage.setItem("configurationKeyBLoaded", true);
    } else if (sessionStorage.getItem("configurationKeyPLoaded") == "false") {
      sessionStorage.setItem("configurationKeyBLoaded", false);

      if (sessionStorage.getItem("loadConfiguration") == "true") {
        location.reload();
      }

      MathJax = {
        startup: {
          pageReady() {
            const options = MathJax.startup.document.options;
            const BaseMathItem = options.MathItem;
            options.MathItem = class FixedMathItem extends (
              BaseMathItem
            ) {
              assistiveMml(document) {
                if (this.display !== null) {
                  super.assistiveMml(document);
                }
              }
            };
            return MathJax.startup.defaultPageReady().then(() => {
              MathJax.config.loadEquationOnPage();
            });
          },
        },
        loadEquationOnPage() {
          view.setVisible(".container-spinner", false);
          view.setVisible(".container-fluid", true);
        },
      };

      if (sessionStorage.getItem("configurationKeyPLoaded") == "false") {
        let scriptTag = document.createElement("script");
        scriptTag.type = "text/javascript";
        scriptTag.defer = true;
        scriptTag.src =
          "https://cdn.jsdelivr.net/npm/mathjax@3.0.1/es5/tex-mml-chtml.js";
        scriptTag.id = "MathJax-script";
        (
          document.getElementsByTagName("head")[0] || document.documentElement
        ).appendChild(scriptTag);
      }

      sessionStorage.setItem("loadConfiguration", true);
      sessionStorage.setItem("configurationKeyPLoaded", true);
    }
  }

  return {
    navigateToPage,
    navigateToNextPage,
    navigateToPrevPage,
    navigateToPrevChapter,
    navigateToNextChapter,
    changeLoadedConfiguration,
  };
})();

var util = {
  createPageId: function (pageNumber) {
    return `page-${pageNumber}`;
  },
};

/**
 * Main function
 */
var main = (function () {
  view.loadPageWithSpecificConfiguration();
  view.createPages();
  view.detectStructure();
  view.createTableOfContent();
  view.spyOnCurrentPage();
  view.spyOnCurrentChapter();
  view.createTooltips();
  hljs.initHighlightingOnLoad();
  view.createCopyButtons();
  view.renderTree();
  new ClipboardJS(".copy-btn");
})();
