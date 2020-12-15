
/**
 * Controller handles all user interactions;
 */
var ctrl = function () {

    function navigateToPage() {
        event.preventDefault();
        const form = {};
        $("#goToPageForm").serializeArray().forEach(element => {
            form[element.name] = element.value;
        });
        if (Util.isNotValidPageNumber(form.pageInput)) {
            alert('Brak podanego numeru strony w publikacji');
            return;
        }
        _navigateToPage(form.pageInput);
    }
    var Util = {
        isNotValidPageNumber: function (pageNumber) {
            return !Number.isInteger(+pageNumber)
                || +pageNumber > model.totalPageNumbers
                || +pageNumber < 1;
        }
    }

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
        const currentChapterIndex = model.getChapterIndexById(model.currentChapterId);
        if (currentChapterIndex < 0) {
            console.error('Current chapter cannot be found in document structure');
            return;
        }
        const targetChapterNode = model.documentStructure[currentChapterIndex + offset]
        if (!targetChapterNode || targetChapterNode.name === 'root') {
            alert('Nie ma więcej rozdziałów')
            return;
        }
        const targetElement = document.getElementById(targetChapterNode.id);
        targetElement.scrollIntoView();
        targetElement.focus();
        model.currentChapterId = targetChapterNode.id;
    }

    function _navigateToPage(targetPageNumber) {
        if (_isNotValidPageNumber(targetPageNumber)) {
            alert('Nie ma więcej stron')
            return;
        }
        const targetElement = document.getElementById(util.createPageId(targetPageNumber));
        targetElement.scrollIntoView();
        targetElement.focus();
        model.currentPage = targetPageNumber;
    }

    function _isNotValidPageNumber(pageNumber) {
        return !Number.isInteger(+pageNumber)
            || +pageNumber > model.totalPageNumbers
            || +pageNumber < 1;
    }

    return {
        navigateToPage,
        navigateToNextPage,
        navigateToPrevPage,
        navigateToPrevChapter,
        navigateToNextChapter
    }
}();

var util = {
    createPageId: function (pageNumber) {
        return `page-${pageNumber}`;
    }
}

/**
 * Main function
 */
var main = function () {
    view.createPages();
    view.detectStructure();
    view.createTableOfContent();
    view.spyOnCurrentPage();
    view.spyOnCurrentChapter();
    view.createTooltips();
    hljs.initHighlightingOnLoad();
    view.createCopyButtons();
    new ClipboardJS('.copy-btn');
}();
