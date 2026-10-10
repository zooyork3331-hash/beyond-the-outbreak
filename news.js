/*
  Beyond the Outbreak: News & Events
  Posts live in news.json. Edit ONLY that file to add/remove announcements.
  Uses textContent rather than injecting HTML from the data file.
*/
(() => {
  'use strict';
  const home = document.getElementById('home-news');
  const list = document.getElementById('news-list');
  const upcoming = document.getElementById('upcoming-events');
  if (!home && !list && !upcoming) return;

  const parseDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') ? value : '';
  const niceDate = value => {
    const stamp = parseDate(value);
    if (!stamp) return 'Date to be confirmed';
    const [y, m, d] = stamp.split('-').map(Number);
    return new Date(Date.UTC(y, m-1, d)).toLocaleDateString('en-US',
      {month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
  };
  const el = (tag, cls, value) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (value !== undefined) node.textContent = value;
    return node;
  };
  const safeLink = href => {
    if (typeof href !== 'string') return null;
    const url = href.trim();
    if (/^https:\/\/[\w.-]+(?:[:\d]+)?(?:[/?#][^\s]*)?$/i.test(url)) return url;
    if (/^[a-z0-9-]+\.html(?:#[a-z0-9-]+)?$/i.test(url)) return url;
    return null;
  };
  const validId = value => /^[a-z0-9-]+$/.test(value || '') ? value : '';
  const validCategory = value => ['Announcement','Event','Patch Notes','Maintenance','Guide'].includes(value) ? value : 'Announcement';
  const validServer = value => ['All Servers','Deer Isle','Badlands'].includes(value) ? value : 'All Servers';
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

  function makeCard(post, compact) {
    const card = el('article', 'news-card');
    if (!compact && validId(post.id)) card.id = post.id;
    const metadata = el('div','news-card-meta');
    const tag = el('span','news-tag',validCategory(post.category));
    tag.dataset.category = validCategory(post.category);
    metadata.append(tag,el('span','news-card-server',validServer(post.server)));
    card.append(metadata,el('div','news-card-date',niceDate(post.date)));
    const heading = el('h3');
    if (compact) {
      const link = el('a',null,String(post.title || 'Community update'));
      link.href = 'news.html#' + (validId(post.id) || 'dispatches');
      heading.appendChild(link);
    } else heading.textContent = String(post.title || 'Community update');
    card.appendChild(heading);
    card.appendChild(el('p','news-summary',String(post.summary || 'More information coming soon.')));
    if (post.category === 'Event' && parseDate(post.eventDate)) {
      card.appendChild(el('div','news-event-meta',`EVENT: ${niceDate(post.eventDate)}${post.eventTime ? ' • '+post.eventTime : ''}${post.location ? ' • '+post.location : ''}`));
    }
    if (compact) {
      const a = el('a','news-card-link','Read full update ↗');
      a.href = 'news.html#'+(validId(post.id)||'dispatches');
      card.appendChild(a);
    } else {
      const details = el('details','news-details');
      details.appendChild(el('summary',null,'Read full update'));
      const content = el('div','news-content');
      const paragraphs = String(post.content || post.summary || '').split(/\n\s*\n/).filter(Boolean);
      paragraphs.forEach(part => content.appendChild(el('p',null,part)));
      const href = safeLink(post.link);
      if (href) {
        const a = el('a',null,String(post.linkText || 'Related information ↗'));
        a.href = href;
        if (href.startsWith('https://')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        content.appendChild(a);
      }
      details.appendChild(content); card.appendChild(details);
    }
    return card;
  }

  function showUpcoming(posts) {
    if (!upcoming) return;
    upcoming.replaceChildren();
    const future = posts.filter(p=>p.category==='Event' && parseDate(p.eventDate) && p.eventDate >= today())
      .sort((a,b)=>a.eventDate.localeCompare(b.eventDate));
    if (!future.length) {
      const message = el('div','news-empty','No events scheduled yet. Confirmed event dates will appear here when announced.');
      upcoming.appendChild(message); return;
    }
    future.slice(0,5).forEach(post => {
      const card=el('article','upcoming-event');
      const d=post.eventDate.split('-');
      const day=el('div','upcoming-date',`${Number(d[2])}`);
      day.appendChild(el('span',null,new Date(Date.UTC(+d[0],+d[1]-1,+d[2])).toLocaleDateString('en-US',{month:'short',year:'numeric',timeZone:'UTC'}).toUpperCase()));
      const desc=el('div');
      desc.append(el('div','news-card-meta',`${validServer(post.server)} / EVENT`),el('h3','upcoming-title',String(post.title || 'Community event')));
      const details=[post.eventTime,post.location].filter(Boolean).join(' • ');
      desc.appendChild(el('div','upcoming-details', details || 'Event details coming soon'));
      const a=el('a',null,'View details ↗'); a.href='#'+(validId(post.id)||'dispatches');
      card.append(day,desc,a); upcoming.appendChild(card);
    });
  }

  const sortPosts = posts => posts.map((p,i)=>({p,i})).sort((a,b)=>String(b.p.date||'').localeCompare(String(a.p.date||'')) || a.i-b.i).map(x=>x.p);
  const showHome = posts => {
    if (!home) return;
    home.replaceChildren();
    if (!posts.length) { home.appendChild(el('p','news-empty','No announcements have been published yet.'));return; }
    posts.slice(0,3).forEach(p=>home.appendChild(makeCard(p,true)));
  };
  function setupArchive(posts) {
    if (!list) return;
    const search = document.getElementById('news-search');
    const category = document.getElementById('news-category');
    const server = document.getElementById('news-server');
    const count = document.getElementById('news-count');
    const clear = document.getElementById('news-clear');
    const render = () => {
      const query=(search.value || '').trim().toLowerCase();
      const filtered=posts.filter(p =>
        (category.value==='all' || p.category===category.value) &&
        (server.value==='all' || p.server===server.value) &&
        (!query || [p.title,p.summary,p.content,p.server,p.category].join(' ').toLowerCase().includes(query))
      );
      list.replaceChildren();
      count.textContent=`${filtered.length} ${filtered.length===1?'dispatch':'dispatches'} found`;
      if (!filtered.length) list.appendChild(el('p','news-empty','No updates match those filters. Try a different search.'));
      else filtered.forEach(p=>list.appendChild(makeCard(p,false)));
      if (location.hash) {
        const targetId=decodeURIComponent(location.hash.slice(1));
        const target=document.getElementById(targetId);
        if (target && target.classList.contains('news-card')) {
          target.scrollIntoView({block:'start'});
          const det=target.querySelector('details'); if (det) det.open=true;
        }
      }
    };
    [search,category,server].forEach(input=>input.addEventListener(input===search?'input':'change',render));
    clear.addEventListener('click',()=>{ search.value='';category.value='all';server.value='all';history.replaceState(null,'',location.pathname);render(); });
    window.addEventListener('hashchange',render);
    render();
  }
  fetch('news.json', {cache:'no-store'})
    .then(response=> { if(!response.ok) throw new Error('File unavailable'); return response.json(); })
    .then(data=> {
      if (!Array.isArray(data)) throw new Error('news.json must contain a list');
      const posts=sortPosts(data.filter(p=>p && typeof p==='object' && p.title && parseDate(p.date)));
      showHome(posts); showUpcoming(posts); setupArchive(posts);
    })
    .catch(()=> {
      const message='The announcements could not be loaded. Check that news.json was uploaded in the main repository folder.';
      [home,list,upcoming].filter(Boolean).forEach(target=>target.replaceChildren(el('p','news-empty',message)));
      const count=document.getElementById('news-count');if(count)count.textContent='Unable to load posts';
    });
})();
