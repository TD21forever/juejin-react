import React, { useReducer } from 'react'
import './dist/index.css'
import { categories, articles, getCategories, getArticles, } from '../../fake-api'
import { Link, Route, useParams } from 'react-router-dom'
import { ch2en, getYMDHMS } from '../../utils'
import debounce from 'lodash.debounce'

export default class Home extends React.Component {

    constructor(props) {
        super(props)

        window.onscroll = debounce(() => {
            const numPerLoad = 5;
            const {
                getArticle,
                state: {
                    curCategoryId,
                    curSortBy
                }
            } = this
            if (this.props.location.pathname === "/" && window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
                getArticle(curCategoryId, curSortBy, this.state.articles.length, numPerLoad)
            }
        }, 100)

    }

    state = {
        articles: [],
        categories: [],

        hasMore: true,

        curSortBy: 'hot',
        curCategoryId: 0,
        curChildCategoryId: -1,
        curCategoryChildren: []

    }
    // 栏目
    getCategories = async () => {
        const res = await getCategories()
        this.setState({ categories: res.data.categories })
    }
    // 文章
    getArticle = async (categoryId, sortBy, offset, limit) => {
        const data = await getArticles(categoryId, sortBy, offset, limit)
        this.setState(
            {
                articles: [
                    ...this.state.articles,
                    ...data.data.articles
                ],
                hasMore: data.has_more
            }
        )
    }
    backTop = () => {
        window.scrollTo(0,0);
    }
    componentDidMount() {
        this.getCategories()
        this.getArticle(this.state.curCategoryId, this.state.curSortBy, 0, 3)
    }
    updateCategoryInfo = async (id) => {
        if (id >= 0 && id < this.state.categories.length) {
            // 这个是父nav
            if (id !== this.state.curCategoryId) {
                this.setState({ curChildCategoryId: -1 })
            }
            let curCategoryChild = this.state.curCategoryChildren
            for (let i = 0; i < this.state.categories.length; i++) {
                let item = this.state.categories[i]
                if (item.category_id === id && item.hasOwnProperty("children")) {
                    curCategoryChild = item.children
                    break
                }
                else {
                    curCategoryChild = []
                }
            }
            this.setState({ curCategoryId: id, curCategoryChildren: curCategoryChild })
        }
        else {
            // 这个是子nav
            this.setState({ curChildCategoryId: id })
        }


    }
    updateArticle = async (id,sortBy=this.state.curSortBy) => {
        const data = await getArticles(id, sortBy, 0, 3)
        this.setState({ articles: data.data.articles, hasMore: data.has_more })

    }
    handleNavClick = (categoryId) => {
        if (categoryId === this.state.curCategoryId) {
            return
        }
        this.backTop()
        this.updateCategoryInfo(categoryId)
        if(categoryId === -1){
            this.updateArticle(this.state.curCategoryId)
        }
        else{

            this.updateArticle(categoryId)
        }

    }
    changeCurSortBy = (method) => {
        this.setState({ curSortBy: method })
    }
    handleFooterClick = (method)=>{
        if(this.state.curSortBy === method)
            return
        this.backTop()
        this.changeCurSortBy(method)
        if(this.curChildCategoryId !== -1){
            this.updateArticle(this.state.curCategoryId,method)
        }
        else{
            this.updateArticle(this.state.curChildCategoryId,method)
        }
    }
    render() {
        return (
            <div>
                <div className="container">
                    <Nav handleNavClick={this.handleNavClick} categories={this.state.categories} curCategoryId={this.state.curCategoryId}></Nav>
                    <ChildNav handleNavClick={this.handleNavClick} categories={this.state.curCategoryChildren} curChildCategoryId={this.state.curChildCategoryId} curCategoryId={this.state.curCategoryId}></ChildNav>
                    <PostList articles={this.state.articles} hasMore={this.state.hasMore}></PostList>
                </div>

                <Footer handleFooterClick={this.handleFooterClick} curSortBy={this.state.curSortBy}></Footer>
            </div>
        )
    }
}

class ChildNav extends React.Component {

    renderRecommendSpan = () => {
        if (this.props.curCategoryId !== 0) {
            // alert(this.props.curCategoryId);
            return (<a href="#" onClick={()=>this.props.handleNavClick(-1)} className={this.props.curChildCategoryId === -1 ? "child-active" : ""}><span>推荐</span></a>)
        }
    }

    renderItems = () => {
        return (

            <>

                {this.renderRecommendSpan()}

                {this.props.categories.map(item => (<Link to={"/"}
                    key={item.category_id}
                    onClick={() => this.props.handleNavClick(item.category_id)}
                    className={this.props.curChildCategoryId === item.category_id ? "child-active" : ""}>
                    <span>{item.category_name}</span>
                </Link>))}
            </>
        )
    }
    render() {
        return (<div className="cn-container">
            {this.renderItems()}
        </div>)
    }
}

class Nav extends React.Component {


    renderNav() {
        return this.props.categories.map(item =>
            (<Link to={"/"} key={item.category_id} onClick={() => this.props.handleNavClick(item.category_id, item.category_name)} className={this.props.curCategoryId === item.category_id ? "active" : ""}>{item.category_name}</Link>)
        )

    }
    render() {
        return (
            <nav className="nav">
                {this.renderNav()}
            </nav>
        )
    }
}

class PostList extends React.Component {

    render() {
        return (
            <>
                {this.props.articles.map(item =>
                    <Post key={item.article_id+Math.random()} article={item} ></Post>
                )
                }
                {!this.props.hasMore &&
                    <div className="end">到底了～</div>
                }
            </>
        )
    }
}

export class Post extends React.Component {

    userInfo = this.props.article.author_user_info
    articleInfo = this.props.article.article_info
    categorieInfo = this.props.article.category_info
    renderImage() {
        if (this.articleInfo.cover_image != "") {
            return (<img src={this.articleInfo.cover_image} className="cover-image"></img>)
        }
    }

    ts2String = (ts) => {
        let timestamp = parseInt(ts) * 1000;
        let res = getYMDHMS(timestamp);
        return res
    }

    render() {
        return (
            <Link to={"/post/" + this.articleInfo.article_id} >
                <div className="post-container" >
                    <div className="meta-container">
                        <div className="author">{this.userInfo.user_name}</div>
                        <div className="date">{(() => this.ts2String(this.articleInfo.ctime))()}</div>
                    </div>
                    <div className="header-container">
                        <div className="post-title">
                            <span>
                                {this.articleInfo.title}
                            </span>
                        </div>
                    </div>
                    <div className="abstract-container">
                        <div className="brief-content">
                            {this.articleInfo.brief_content}
                        </div>
                        {this.renderImage()}
                    </div>
                    <div className="foot-container">
                        <div className="icons">
                            <span><i className="iconfont icon-thumb"></i>   {this.articleInfo.collect_count}</span>
                            <span><i className="iconfont icon-comment"></i>   {this.articleInfo.comment_count}</span>
                        </div>
                        <div className="tags">
                            <span>{this.categorieInfo.first_category_name}</span>
                            <span>{this.categorieInfo.second_category_name}</span>
                        </div>
                    </div>
                    <hr />
                </div>
            </Link>)
    }
}


class Footer extends React.Component {
    tabbarList = ["热门", "最新"]
    handleClick = (method) => {
        if (method === "热门")
            this.props.handleFooterClick('hot')
        else if (method === "最新")
            this.props.handleFooterClick("new")
    }
    handleActivate = (method)=>{
        let en = ""
        if(method === "热门")
            en = "hot"
        else
            en = "new"
        if(en === this.props.curSortBy)
            return "activate"
        else
            return ""
        
    }       

    renderTabbar() {
        return (
            <>
                {this.tabbarList.map(item =>
                    <a href="javascript:void(0)" key={item} onClick={() => { this.handleClick(item) }} className={this.handleActivate(item)}>{item}</a>
                )
                }
                <Link to="/history">历史</Link>

            </>
        )
    }
    render() {
        return (
            <footer className="tabbar-container">
                {this.renderTabbar()}
            </footer>)
    }
}
