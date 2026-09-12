import React from 'react';
import './SystemWindow.css';

const SystemWindow = () => {
    return (
        <div className="system-wrapper">
            <div className="system-container">
                
                {/* SVG Drawing - Refined to match the outward spikes and inward dips */}
                <svg className="lotus-border" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="border-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8dd7ff" />
                            <stop offset="42%" stopColor="#6f9dff" />
                            <stop offset="72%" stopColor="#b48cff" />
                            <stop offset="100%" stopColor="#66d8ff" />
                        </linearGradient>
                    </defs>
                    <path className="outer-scallop" d="
                      M 0,0 
                      
                      Q 25, 20 50, 0 
                      Q 75, 20 100, 0 
                      
                      Q 80, 16.6 100, 33.3 
                      Q 80, 50 100, 66.6 
                      Q 80, 83.3 100, 100 
                      
                      Q 75, 80 50, 100 
                      Q 25, 80 0, 100 
                      
                      Q 20, 83.3 0, 66.6 
                      Q 20, 50 0, 33.3 
                      Q 20, 16.6 0, 0 Z
                    "/>
                                        <path className="secondary-scallop" d="
                                            M 0,0
                                            Q 25, 20 50, 0
                                            Q 75, 20 100, 0
                                            Q 80, 16.6 100, 33.3
                                            Q 80, 50 100, 66.6
                                            Q 80, 83.3 100, 100
                                            Q 75, 80 50, 100
                                            Q 25, 80 0, 100
                                            Q 20, 83.3 0, 66.6
                                            Q 20, 50 0, 33.3
                                            Q 20, 16.6 0, 0 Z
                                        "/>
                    <rect className="inner-rect" x="10" y="10" width="80" height="80" />
                </svg>

                {/* 4-Panel Grid Layout */}
                <div className="grid-layout">
                    
                    <div className="panel panel-top-left">
                        <div className="panel-title">[ STATUS WINDOW ]</div>
                        <div className="content-line"></div>
                        <div className="content-line"></div>
                        <div className="content-line short"></div>
                    </div>

                    <div className="panel panel-bottom-left-1">
                        <div className="panel-title">[ SKILLS ]</div>
                        <div className="content-line"></div>
                        <div className="content-line short"></div>
                    </div>

                    <div className="panel panel-bottom-left-2">
                        <div className="panel-title">[ INVENTORY ]</div>
                        <div className="content-line"></div>
                        <div className="content-line short"></div>
                    </div>

                    <div className="panel panel-right-tall">
                        <div className="panel-title">[ QUEST DIRECTIVE ]</div>
                        <div className="content-line"></div>
                        <div className="content-line"></div>
                        <div className="content-line"></div>
                        <div className="content-line short"></div>
                        <div className="content-line" style={{ marginTop: 'auto' }}></div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SystemWindow;
