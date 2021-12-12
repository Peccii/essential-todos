import React, {useEffect}from "react";
import {useParams} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import * as ricActions from '../application/actions/ricActions';
import { getRic, getStatusOptions, getError} from '../application/selectors/ricSelector';

import { getLoading } from '../application/selectors/ui';
import { pageLoaded } from '../application/actions/ui';

import  './Ric.css';

export default ()=>{

    let { id } = useParams();
    const dispatch = useDispatch();
    const ric = useSelector(getRic);
    const statusOptions = useSelector(getStatusOptions);
    const loading = useSelector(getLoading);
    const error= useSelector(getError);

    const dragStart = target => {
        target.classList.add('dragging');
    };
    
    const dragEnd = target => {
        target.classList.remove('dragging');
    };
    
    const dragEnter = event => {
        event.currentTarget.classList.add('drop');
    };
    
    const dragLeave = event => {
        event.currentTarget.classList.remove('drop');
    };
    
    const drag = event => {
        event.dataTransfer.setData('text/html', event.currentTarget.outerHTML);
        event.dataTransfer.setData('text/plain', event.currentTarget.dataset.id);
    };
    
    const drop = event => {
       // const data = event.dataTransfer.getData('text/plain');
        const codeId= event.dataTransfer.getData('text/plain');
        const statusId=event.currentTarget.id;
        
        // romve drop style from target
        document.querySelectorAll('.status').forEach(status => status.classList.remove('drop'));

       dispatch(ricActions.updateRicStatus({codeId:codeId, statusId:statusId}));
       
    };
    
    const allowDrop = event => {
        event.preventDefault();
    };
    
    useEffect(() => {
        dispatch(pageLoaded);
        dispatch(ricActions.loadRic(id));
    }, [dispatch, id]);

    useEffect(()=>{

        document.querySelectorAll('.status').forEach(status => {
            status.addEventListener('dragenter', dragEnter);
            status.addEventListener('dragleave', dragLeave);
        });
        
        document.addEventListener('dragstart', e => {
            try{
                if (e.target.className.includes('card')) {
                    dragStart(e.target);
                }
            }
            catch{}
        });
        
        document.addEventListener('dragend', e => {
            try{
                if (e.target.className.includes('card')) {
                    dragEnd(e.target);
                }
            }
            catch{}
        }, []);
    
})
    return (  
            <>{loading ? 'Loading ric...' : (
                <>
                    <h2>Registre des installations classées {id}</h2>
                    <h3>{error}</h3>
                    <main className="board">
                    {statusOptions.map(option =>
                    (           
                        <div key={option.name} id={option.name} 
                        draggable="false" 
                            className={"status status-"+option.name} onDrop={e=> drop(e)} onDragOver={e=>allowDrop(e)}>
                            <h2>{option.description}</h2>
                            {ric.filter(s=>s.statusId===option.name).map(c=>
                                (
                                    <article key={c.codeId} className="card" 
                                        draggable="true" 
                                        onDragStart={e=>drag(e)}         
                                        data-id={c.codeId}>
                                        <h3>{'Code N°'+c.codeId}</h3>
                                    </article>
                                )
                            )}
                        </div>
                    )
                        
                    )}
                    </main>                 
                </>)}
        
            </>);
}