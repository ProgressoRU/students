(function () {
    'use strict';

    angular
        .module('students')
        .controller('NewsController', NewsController);

    NewsController.$inject = ['DataService', 'alertService'];

    function NewsController(DataService, alertService) {
        /*jshint validthis: true */
        var vm = this;

        vm.news = [];
        vm.editable = false;
        vm.editMode = false;
        vm.postMode = false;
        vm.visibleNews = [];
        vm.totalItems = 0;
        vm.currentPage = 1;
        vm.test = 'test';

        vm.currentPageNews = currentPageNews;
        vm.newPost = newPost;
        vm.editPost = editPost;
        vm.cancelEdit = cancelEdit;
        vm.performEdit = performEdit;
        vm.deleteNews = deleteNews;
        vm.getNews = getNews;

        activate();
        //////////////////////////
        function activate() {
            getNews();
        }

        function currentPageNews(count) {
            vm.visibleNews = [];
            var startPosition = vm.totalItems - vm.currentPage * count;
            var j = 0;
            for (var i = startPosition; j < count; j++, i++) {
                vm.visibleNews[j] = vm.news[i];
            }
            return vm.visibleNews.reverse();
        }

        function newPost() {
            vm.postMode = true;
            vm.editMode = false;
            vm.editable = {
                body: '',
                title: '',
                label: 0
            };
            vm.idInDb = 0;
            vm.idInJson = null;
        }

        function editPost(idInDb) {
            for (var i = 0; i < vm.totalItems; i++)
                if (vm.news[i].news_id == idInDb) {
                    vm.idInDb = vm.news[i].news_id;
                    vm.idInJson = i;
                }
            vm.editable = {
                body: vm.news[vm.idInJson].news,
                title: vm.news[vm.idInJson].title,
                label: vm.news[vm.idInJson].importance
            };
            vm.editMode = true;
            vm.postMode = false;
        }

        function cancelEdit() {
            vm.editMode = false;
            vm.postMode = false;
            vm.editable = null;
            vm.idInDb = null;
            vm.idInJson = null;
        }

        function performEdit() {
            if (vm.editable.title == null || vm.editable.body == null) {
                alertService.push(11);
            }
            else if (vm.editable.title.length <= 3 || vm.editable.title.length > 100)
                alertService.push(12);
            else {
                DataService.get('api/news/edit', {
                    id: vm.idInDb,
                    title: vm.editable.title,
                    news: vm.editable.body,
                    label: vm.editable.label
                }).then(function (data) {
                    if (!data.status) alertService.push(0);
                    //если пришел ответ с запретом
                    else if (data.status == 403) alertService.push(403);
                    else if (data.status == 500) alertService.push(500);
                    else if (data.status == 11) alertService.push(11);
                    //Если доступ разрешен
                    else if (data.status == 10) {
                        alertService.push(10);
                        vm.editMode = false;
                        vm.postMode = false;
                        vm.editable = null;
                        vm.idInDb = null;
                        vm.idInJson = null;
                        vm.getNews();
                    }
                })
            }
        }

        function deleteNews(id) {
            DataService.get('api/news/delete', {id: id}).then(function (data) {
                if (!data.status) alertService.push(0);
                //если пришел ответ с запретом
                else if (data.status == 403) alertService.push(403);
                else if (data.status == 500) alertService.push(500);
                //Если доступ разрешен
                else if (data.status == 13) {
                    alertService.push(13);
                    vm.getNews();
                }
            });
        }

        function getNews() {
            DataService.get('api/news/all').then(function (data) {
                //если ответ не пришел
                if (!data.status) alertService.push(0);
                //если пришел ответ с запретом
                else if (data.status == 500) alertService.push(500);
                //Если доступ разрешен
                else if (data.status == 1) {
                    vm.news = data.news;
                    vm.currentPage = 1;
                    vm.totalItems = data.news.length;
                    vm.editMode = false;
                }
            });
        }
    }
})();
