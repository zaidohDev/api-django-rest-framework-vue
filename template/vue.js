new Vue({
    el: '#starting',
    delimiters:['${','}'],
    data: {
        articles: [],
        loading: false,
        currentArticle: {},
        message: null,
        newArticle: {
            ‘article_heading’: null, ‘article_body’: null},
    },

    mounted: function(){
        this.getArticles();
    },

    methods: {
        getArticles: function(){
            this.loading = true;
            this.$http.get('/api/article/')
                .then((response) => {
                  this.articles = response.data;
                  this.loading = false;
                })
                .catch((err) => {
                  this.loading = false;
                  console.log(err);
                })
        },
        getArticle: function(id){
           this.loading = true;
           this.$http.get(`/api/article/${id}/`)
                .then((response)=> {
                  this.currentArticle = response.data;
                  this.loading = false;
                })
                .catch((err) =>{
                  this.loading = false;
                  console.log(err);
                })
        },
        addArticle: function(){
            this.loading = true;
            this.$http.post('/api/article/', this.newArticle)
                .then((response)=> {
                  this.currentArticle = response.data;
                  this.loading = false;
                })
                .catch((err) =>{
                  this.loading = false;
                  console.log(err);
                })
        },
        updateArticle: function(){
            this.loading = true;
            this.$http.put(`/api/article/${this.currentArticle.article_id}/`, this.currentArticle)
                .then((response)=> {
                  this.loading = false
                  this.getArticles();
                })
                .catch((err) =>{
                  this.loading = false;
                  console.log(err);
                })
        },
        deleteArticle: function(){
            this.loading = true;
            this.$http.delete(`/api/article/${id}/`)
                .then((response)=> {
                  this.currentArticle = response.data;
                  this.loading = false;
                })
                .catch((err) =>{
                  this.loading = false;
                  console.log(err);
                })
        }

    }
});
