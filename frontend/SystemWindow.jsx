import React from 'react';
import './SystemWindow.css';

const SystemWindow = () => {
    return (
        <div className="system-wrapper">
            <svg className="devil-hand" viewBox="0 0 1000 900" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                    <linearGradient id="hand-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#09070f" />
                        <stop offset="62%" stopColor="#171329" />
                        <stop offset="100%" stopColor="#35152f" />
                    </linearGradient>
                </defs>
                <path className="hand-shadow" d="M155 900 C132 790 150 685 197 590 C227 530 225 475 202 414 C184 366 193 337 221 329 C253 320 272 355 284 396 L325 527 C315 403 300 269 316 169 C323 124 348 101 376 108 C406 116 413 148 413 190 L420 452 C429 322 430 172 451 82 C462 35 492 14 519 25 C548 37 549 74 542 117 L531 449 C551 322 571 181 600 111 C616 71 646 56 670 72 C696 89 689 126 678 166 L619 460 C652 373 691 272 729 225 C754 194 785 196 801 217 C818 239 800 270 779 303 L679 481 C727 429 780 379 826 366 C860 356 886 374 888 400 C890 427 863 444 829 465 L701 568 C769 539 834 530 874 549 C904 564 910 594 894 613 C877 633 846 625 810 618 L671 616 C750 661 809 725 823 797 C830 834 826 870 818 900 Z" />
                <path className="hand-highlight" d="M216 393 C244 381 260 409 270 450 L322 596 M419 452 C432 338 435 188 456 101 M531 449 C554 326 573 191 603 122 M619 460 C661 356 701 278 738 239 M679 481 C738 420 787 390 832 386" />
            </svg>
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
