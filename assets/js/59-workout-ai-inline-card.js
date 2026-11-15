/* ATHLETIC PHYSIQUE — Stage 18 Workout AI Inline Card
 * Moves the Stage 13 unified recommendation and Stage 14 decision trace
 * from the top of the active workout into the current exercise card.
 * Presentation-only: recommendation logic and stored training data are unchanged.
 */
(function(){
  'use strict';

  function extractDiv(html, marker){
    const start=html.indexOf(marker);
    if(start<0)return {html,block:''};
    const open=html.lastIndexOf('<div',start);
    if(open<0)return {html,block:''};
    let i=open,depth=0;
    const token=/<\/?div\b[^>]*>/gi;
    token.lastIndex=open;
    let m;
    while((m=token.exec(html))){
      const t=m[0];
      if(/^<\/div/i.test(t))depth--;else if(!/\/>$/.test(t))depth++;
      if(depth===0){
        const end=token.lastIndex;
        return {html:html.slice(0,open)+html.slice(end),block:html.slice(open,end)};
      }
    }
    return {html,block:''};
  }

  function extractDetails(html, marker){
    const start=html.indexOf(marker);
    if(start<0)return {html,block:''};
    const open=html.lastIndexOf('<details',start);
    const close=html.indexOf('</details>',start);
    if(open<0||close<0)return {html,block:''};
    const end=close+'</details>'.length;
    return {html:html.slice(0,open)+html.slice(end),block:html.slice(open,end)};
  }

  function moveInline(html){
    if(typeof html!=='string') return html;
    if(typeof tab==='undefined' || tab!=='workout') return html;
    if(!html.includes('wk-exercise-card')) return html;

    // Stage 13 and Stage 14 are rendered as separate siblings before the session bar.
    // Extract them independently; relying on sibling adjacency breaks once the trace
    // is inserted between the recommendation and the session bar.
    let panel='',trace='';
    let r=extractDiv(html,'class="ap-stage13-unified-note"');
    html=r.html; panel=r.block;
    r=extractDetails(html,'class="ap-stage14-trace"');
    html=r.html; trace=r.block;
    if(!panel && !trace) return html;

    const ai=`<div class="ap-exercise-ai" data-ai-inline="true">${panel}${trace}</div>`;
    const targetRe=/(<div class="wk-target-line">[\s\S]*?<\/div>)/;
    if(targetRe.test(html)) return html.replace(targetRe,'$1'+ai);

    const cardRe=/(<section class="card wk-exercise-card[^\"]*">)/;
    if(cardRe.test(html)) return html.replace(cardRe,'$1'+ai);
    return html;
  }

  if(typeof window.view==='function'&&!window.view.__apStage18InlineAI){
    const oldView=window.view;
    const wrapped=function(){
      return moveInline(oldView.apply(this,arguments));
    };
    wrapped.__apStage18InlineAI=true;
    window.view=wrapped;
  }

  window.apWorkoutAIInline={version:2,ready:true,moveInline};
  document.documentElement.dataset.workoutAIInline='v2';
})();
