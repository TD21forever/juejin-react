import React, { Component } from 'react';
import {Post} from '../Home/index'
import { getArticleById } from '../../fake-api'
import "./dist/index.css"
class History extends Component {

    state = {
        articleInfo : []
    }
    
    getArticle = async ()=>{
        let storage = window.localStorage
        let historyID = JSON.parse(storage.getItem("historyID"))
        if(historyID === null){
            historyID = []
        }
        let articleArray = []

        for(let i=0;i<historyID.length;i++){
            let data = await getArticleById(historyID[i])
            let articleInfo = data.data.article
            articleArray.push(articleInfo)
        }
        this.setState({articleInfo:articleArray})
    }

    componentDidMount(){
        this.getArticle()
    }

    renderNoHistory = ()=>{
        console.log(this.state.articleInfo.length === 0);
        if(this.state.articleInfo.length === 0)
            return (

                <div className="no-history">

                    <h3> 没有历史记录，快去浏览哦～～～ </h3>

                </div>

            )
    }

    render() {
        return (
            <div className="history-container">
                { this.renderNoHistory() }
                {this.state.articleInfo.map(item => (<Post article={item}></Post>))}
            </div> 
            )
            
        }
}

export default History;