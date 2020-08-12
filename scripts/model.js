class DocumentNode {

    constructor(id, level, name, parent, element) {
        this.id = id;
        this.level = level;
        this.name = name;
        this.parent = parent;
        this.element = element;
        this.children = [];
    }
}

var model = function () {
    const documentRoot = new DocumentNode('', 1, 'root', null, null);
    const totalPageNumbers = 0;
    const currentPage = 1;
    const currentChapterId = documentRoot.id;
    const documentStructure = [documentRoot];
    const documentPageElements = [];

    function getChapterIndexById(chapterId) {
        return documentStructure.findIndex(node => node.id === chapterId);
    }

    return {
        totalPageNumbers,
        currentPage,
        currentChapterId,
        documentRoot,
        documentStructure,
        documentPageElements,

        getChapterIndexById
    }
}();


