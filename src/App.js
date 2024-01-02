import './App.css';
import {useState} from 'react';
import { HiStar } from "react-icons/hi2";

// 제목 Component
function Header(props){ 
  return <header>
  <h1 className='header_'><a className="header-title" href="/" onClick={(event)=>{
    event.preventDefault();
    props.onChangeMode();
  }}>{props.title}</a></h1>
</header>
}

// QNA 리스트 메뉴 Component
function Nav(props){ 
  const lis = [
    // <li><a href="/read/1">html</a></li>,
    // <li><a href="/read/2">css</a></li>,
    // <li><a href="/read/3">js</a></li>
  ]
  for(let i=0; i<props.topics.length; i++){ // 반복문 이용하여 topics 객체 배열 갖고 오기
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id)); // 문자를 숫자로 변환(id)
      }}>{t.title}</a>
      </li>)
  }
  return <nav>
  <ol className='ol_style'>
   {lis}
  </ol>
</nav>
}

// 본문 내용 Component
function Article(props){ 
  return <article className='article_'>
  <h2 className='content_title'>{props.title}</h2>
  {props.body}
</article>
}

function Create(props){ // Create
  return <article className='create_article'>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault(); // page가 reload되는 것을 막기 위함
      const title = event.target.title.value; // 사용자가 입력한 제목 전달 받음
      const body = event.target.body.value;  // 사용자가 입력한 내용 전달 받음
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title"/></p> 
      <p><textarea name="body" placeholder="body"></textarea></p>
      <p><input className="create_btn" type="submit" value="Create"></input></p> 
    </form>
  </article>
}
function Update(props) { // Update
  const [title, setTitle] = useState(props.title); // title state 만들기
  const [body, setBody] = useState(props.body); // body state 만들기
  return <article className='update_article'>
    <h2>Update</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
        setTitle(event.target.value);
      }}/></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={event=>{
        setBody(event.target.value);
      }}></textarea></p>
      <p><input className='update_btn' type="submit" value="Update"></input></p>
    </form>
  </article>
}
function App() {
  // const _mode = useState('WELCOME');
  // const mode = _mode[0];
  // const setMode = _mode[1];
  const [mode, setMode] = useState('WELCOME'); // 위의 세줄과 같은 의미
  const [id, setId] = useState(null); // id state로 별도 보관
  const [nextId, setNextId] = useState(4); // 다음에 추가될 내용의 id state
  const [topics, setTopics] = useState([ // QNA 리스트 메뉴 객체 배열 생성
    {id:1, title:'html', body:'html'},
    {id:2, title:'css', body:'css'},
    {id:3, title:'javascript', body:'javascript'}
  ]);
  let content = null;
  let contextControl = null;
  if (mode === 'WELCOME'){ // 첫 화면
    content = <Article title="Welcome" body="Feel free to ask questions"></Article>
  } else if (mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <li className='ul_list_2'><a href={"/update"+id} onClick={event=>{
        event.preventDefault();
        setMode('UPDATE');
      }}><HiStar /> 수정</a></li>
      <li className='ul_list_3'><input className='delete_btn' type="button" value="삭제" onClick= {()=>{
        const newTopics = []
        for (let i=0; i<topics.length; i++){
          if(topics[i].id !== id){
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }}/></li>
    </>
  } else if (mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics]
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  } else if (mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      const newTopics = [...topics]
      const updatedTopic = {id:id, title:title, body:body}
      for (let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }
  return (
    <div>
      <Header title="Front-End QNA" onChangeMode={()=>{
        setMode('WELCOME');
      }}></Header>
      <div className='background'>
        <div className='title_bar'>QNA list</div>
        <Nav topics={topics} onChangeMode={(_id)=>{
          setMode('READ');
          setId(_id);
        }}></Nav>
        <div className='title_bar'>Content</div>
        {content}
        <ul className='ul_style'>
          <li className='ul_list_1'><a href="/create" onClick={(event=>{
            event.preventDefault();
            setMode('CREATE');
          })}><HiStar /> 등록</a></li>
          {contextControl}
        </ul>
      </div>
    </div>
  );  
}

export default App;
