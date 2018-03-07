import { UI } from '../core/ui';

export class PluginScrollShadow {
    private rootElement: HTMLElement;
    private scrollBefore: HTMLElement;
    private scrollAfter: HTMLElement;
    private headerParentElement: HTMLElement;
    private headerElement: HTMLElement;
    private footerParentElement: HTMLElement;
    private footerElement: HTMLElement;
    private mutationObserver: MutationObserver;

    private scrollData: any = {
        offsetTop: undefined,
        offsetBottom: undefined
    };

    private properties: any = {
        mobileBreakpoint: 980,
        height: 8,
        initialColor: 'rgba(84, 84, 84, .3)',
        finalColor: 'rgba(255, 255, 255, 0)',
        headerElement: undefined,
        footerElement: undefined,
        workMobile: true
    };

    public static readonly PROPERTIES: any = {
        DATA_PLUGIN_SHADOW_HEIGHT: 'data-plugin-shadow-height',
        DATA_PLUGIN_SHADOW_INITIAL_COLOR: 'data-plugin-shadow-initial-color',
        DATA_PLUGIN_SHADOW_FINAL_COLOR: 'data-plugin-shadow-final-color',
        DATA_PLUGIN_SHADOW_HEADER: 'data-plugin-shadow-header',
        DATA_PLUGIN_SHADOW_FOOTER: 'data-plugin-shadow-footer',
        DATA_PLUGIN_SHADOW_MOBILE: 'data-plugin-shadow-mobile'
    };

    public static readonly CSS_CLASSES: any = {
        ROOT: 'plugin-scroll-shadow',
        SCROLLER: 'plugin-scroll-shadow__scroller',
        SCROLL_BEFORE: 'plugin-scroll-shadow__scroller__before',
        SCROLL_AFTER: 'plugin-scroll-shadow__scroller__after',
        HEADER: 'plugin-scroll-shadow__header',
        FOOTER: 'plugin-scroll-shadow__footer'
    };

    public static readonly CSS_VARIABLES: any = {
        SHADOW_HEIGHT: '--plugin-shadow-height',
        SHADOW_TOP_OFFSET: '--plugin-shadow-offset-top',
        SHADOW_BOTTOM_OFFSET: '--plugin-shadow-offset-bottom',
        SHADOW_TOP_HEIGHT: '--plugin-shadow-top-maxHeight',
        SHADOW_BOTTOM_HEIGHT: '--plugin-shadow-bottom-maxHeight',
        SHADOW_INITIAL_COLOR: '--plugin-shadow-initial-backgroundColor',
        SHADOW_FINAL_COLOR: '--plugin-shadow-final-backgroundColor'
    };

    constructor(root?: HTMLElement, properties?: Object) {
        if (root instanceof HTMLElement) {
            this.rootElement = root;
        } else {
            this.rootElement = document.querySelector(root);
        }
        this.rootElement.classList.add(PluginScrollShadow.CSS_CLASSES.ROOT);
        this.properties = (<any>Object).assign(this.properties, properties);
        // update properties if defined inline
        this.properties = (<any>Object).assign(this.properties, {
            height: (isNaN(parseInt(this.rootElement.getAttribute(PluginScrollShadow.PROPERTIES.DATA_PLUGIN_SHADOW_HEIGHT))) ?
                this.properties.height :
                parseInt(this.rootElement.getAttribute(PluginScrollShadow.PROPERTIES.DATA_PLUGIN_SHADOW_HEIGHT))),
            initialColor: this.rootElement.getAttribute(PluginScrollShadow.PROPERTIES.DATA_PLUGIN_SHADOW_INITIAL_COLOR)
                || this.properties.initialColor,
            finalColor: this.rootElement.getAttribute(PluginScrollShadow.PROPERTIES.DATA_PLUGIN_SHADOW_FINAL_COLOR)
                || this.properties.finalColor,
            headerElement: this.rootElement.getAttribute(PluginScrollShadow.PROPERTIES.DATA_PLUGIN_SHADOW_HEADER)
                || this.properties.headerElement,
            footerElement: this.rootElement.getAttribute(PluginScrollShadow.PROPERTIES.DATA_PLUGIN_SHADOW_FOOTER)
                || this.properties.footerElement,
            workInMobile:
                ((this.rootElement.getAttribute(PluginScrollShadow.PROPERTIES.DATA_PLUGIN_SHADOW_MOBILE) &&
                    (this.rootElement.getAttribute(PluginScrollShadow.PROPERTIES.DATA_PLUGIN_SHADOW_MOBILE).toLowerCase() === 'false')) ?
                    this.rootElement.getAttribute(PluginScrollShadow.PROPERTIES.DATA_PLUGIN_SHADOW_MOBILE).toLowerCase() :
                    this.properties.workMobile)
        });

        try {
            this.init();
            this.buildUI();
            this.setProperties();
            this.updateScrollData();
        } catch (e) {
            console.error(e.message);
            this.destroy();
        }
    }

    public init(): void {
        this.registerEventHandler();
    }

    public destroy(): void {
        this.deRegisterEventHandler();
    }

    private handlers() {
        return {
            elementScroll: {
                event: 'scroll',
                callback: this.updateScrollData
            },
            windowResize: {
                event: 'resize',
                callback: this.onResize
            }
        };
    }

    private registerEventHandler(): void {
        this.setObservable();
        window.addEventListener(this.handlers().elementScroll.event, this.handlers().elementScroll.callback);
        window.addEventListener(this.handlers().windowResize.event, this.handlers().windowResize.callback);
    }

    private deRegisterEventHandler(): void {
        window.removeEventListener(this.handlers().elementScroll.event, this.handlers().elementScroll.callback);
        window.removeEventListener(this.handlers().windowResize.event, this.handlers().windowResize.callback);
        this.mutationObserver.disconnect();

    }

    /**
     * Method responsible for creating the shadow elements.
     */
    private buildUI = () => {
        /**
         * HEADER
         * If header element class was passed, then apply shadow to it
         */
        if (this.properties.headerElement) {
            this.headerParentElement = this.rootElement.parentElement.querySelector('.' + this.properties.headerElement);
            if (!this.headerParentElement) {
                throw new Error('ERROR: No header element found: ' + this.properties.headerElement.toString());
            }
            this.headerParentElement.style.position = 'relative';
            const shadowDiv = document.createElement('div');
            shadowDiv.classList.add(PluginScrollShadow.CSS_CLASSES.HEADER);
            this.headerParentElement.appendChild(shadowDiv);
            this.headerElement = this.headerParentElement.querySelector('.' + PluginScrollShadow.CSS_CLASSES.HEADER);
        }
        /**
         * BODY
         * Create a wrapper with all content
         */
        const scrollerDiv = document.createElement('div');
        scrollerDiv.classList.add(PluginScrollShadow.CSS_CLASSES.SCROLLER);

        // If header element not exist, create div to apply shadow before content
        if (this.properties.headerElement === undefined) {
            const before = document.createElement('div');
            before.classList.add(PluginScrollShadow.CSS_CLASSES.SCROLL_BEFORE);
            scrollerDiv.appendChild(before);
        }

        // Append all content to new div
        if (this.rootElement.childElementCount < 1) {
            scrollerDiv.appendChild(this.rootElement.firstChild);
        } else {
            for (let i = 0; i < this.rootElement.children.length; i++) {
                scrollerDiv.appendChild(this.rootElement.children[i]);
            }
        }

        // If footer element not exist, create div to apply shadow before content
        if (this.properties.footerElement === undefined) {
            const after = document.createElement('div');
            after.classList.add(PluginScrollShadow.CSS_CLASSES.SCROLL_AFTER);
            scrollerDiv.appendChild(after);
        }

        //Dispatch a scroll event from the created div to window
        this.rootElement.appendChild(scrollerDiv);
        this.rootElement.addEventListener('scroll', (ev: Event) => {
            const event = new Event('scroll');
            event.initEvent('scroll', true, true);
            window.dispatchEvent(event);
        }, false);
        /**
         * FOOTER
         * If footer element class was passed, then apply shadow to it
         */
        if (this.properties.footerElement) {
            this.footerParentElement = this.rootElement.parentElement.querySelector('.' + this.properties.footerElement);
            if (!this.footerParentElement) {
                throw new Error('ERROR: No footer element found: ' + this.properties.footerElement.toString());
            }
            this.footerParentElement.style.position = 'relative';
            const shadowDiv = document.createElement('div');
            shadowDiv.classList.add(PluginScrollShadow.CSS_CLASSES.FOOTER);
            this.footerParentElement.appendChild(shadowDiv);
            this.footerElement = this.footerParentElement.querySelector('.' + PluginScrollShadow.CSS_CLASSES.FOOTER);
        }
    }

    /**
     * Method responsible for setting the default shadow elements properties.
     */
    private setProperties() {
        const propStyle: any = {};
        propStyle[PluginScrollShadow.CSS_VARIABLES.SHADOW_INITIAL_COLOR] = this.properties.initialColor;
        propStyle[PluginScrollShadow.CSS_VARIABLES.SHADOW_FINAL_COLOR] = this.properties.finalColor;
        propStyle[PluginScrollShadow.CSS_VARIABLES.SHADOW_HEIGHT] = this.properties.height + 'px';

        if (this.properties.headerElement) {
            UI.changeProperty(this.headerElement, propStyle);
        } else {
            this.scrollBefore = this.rootElement.querySelector('.' + PluginScrollShadow.CSS_CLASSES.SCROLL_BEFORE);
            if (!this.scrollBefore) {
                throw new Error('ERROR: No element top shadow found! Class: ' + PluginScrollShadow.CSS_CLASSES.SCROLL_BEFORE);
            }
            UI.changeProperty(this.scrollBefore, propStyle);
        }
        if (this.properties.footerElement) {
            UI.changeProperty(this.footerElement, propStyle);
        } else {
            this.scrollAfter = this.rootElement.querySelector('.' + PluginScrollShadow.CSS_CLASSES.SCROLL_AFTER);
            if (!this.scrollAfter) {
                throw new Error('ERROR: No element bottom shadow found! Class: ' + PluginScrollShadow.CSS_CLASSES.SCROLL_AFTER);
            }
            UI.changeProperty(this.scrollAfter, propStyle);

        }
    }

    /**
     * Listener to detect div height change
     * @type {MutationObserver}
     */
    private setObservable() {
        this.mutationObserver = new MutationObserver(this.onMutation);
        this.mutationObserver.observe(this.rootElement.parentElement, {
            attributes: true,
            childList: true,
            characterData: false,
            subtree: true,
            attributeFilter: ['class']
        });
    }

    /**
     * Method responsible to call method responsible for updating.
     * The timeout is needed because the observable is too fast and the calculation isn't doing correctly.
     */
    private onMutation = () => {
        setTimeout(this.updateScrollData, 10);
    }

    /**
     * Method responsible for updating the shadow elements data on scroll.
     */
    private updateScrollData = () => {
        this.updateShadowPosition();
        this.checkState();
    }

    /**
     * Method to disable shadow in mobile, if variable workInMobile = false
     */
    private onResize = () => {
        if (this.isMobile() && this.properties.workInMobile === 'false') {
            if (this.headerParentElement) {
                this.headerParentElement.style.position = '';
            }
            if (this.footerParentElement) {
                this.footerParentElement.style.position = '';
            }
            window.removeEventListener(this.handlers().elementScroll.event, this.handlers().elementScroll.callback);
            this.mutationObserver.disconnect();
        } else {
            if (this.headerParentElement) {
                this.headerParentElement.style.position = 'relative';
            }
            if (this.footerParentElement) {
                this.footerParentElement.style.position = 'relative';
            }
            this.setObservable();
            window.addEventListener(this.handlers().elementScroll.event, this.handlers().elementScroll.callback);
            this.updateScrollData();
        }
    }

    /**
     * Method responsible for updating the shadow position.
     */
    private updateShadowPosition() {
        this.scrollData = {
            offsetTop: this.rootElement.scrollTop,
            offsetBottom: this.rootElement.scrollHeight - (this.rootElement.scrollTop + this.rootElement.clientHeight)
        };

        /**
         * Update offset position if no header or top passed by HTML
         */
        if (this.properties.headerElement === undefined) {
            const propStyleTop: any = {};
            propStyleTop[PluginScrollShadow.CSS_VARIABLES.SHADOW_TOP_OFFSET] = this.scrollData.offsetTop + 'px';
            UI.changeProperty(this.scrollBefore, propStyleTop);
        }
        if (this.properties.footerElement === undefined) {
            const propStyleBottom: any = {};
            propStyleBottom[PluginScrollShadow.CSS_VARIABLES.SHADOW_BOTTOM_OFFSET] = this.scrollData.offsetBottom + 'px';
            UI.changeProperty(this.scrollAfter, propStyleBottom);
        }
    }

    /**
     * Check if component has available scroll on top or bottom and applies a related class
     */
    private checkState(): void {
        if (this.scrollData.offsetTop > 0 && this.scrollData.offsetBottom > 0) {
            // Set both shadows
            if (this.properties.headerElement) {
                this.fadeInShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_TOP_HEIGHT, this.headerElement);
            } else {
                this.fadeInShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_TOP_HEIGHT, this.scrollBefore);
            }
            if (this.properties.footerElement) {
                this.fadeInShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_BOTTOM_HEIGHT, this.footerElement);
            } else {
                this.fadeInShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_BOTTOM_HEIGHT, this.scrollAfter);
            }
        } else if (this.scrollData.offsetTop > 0) {
            // Set only top shadow
            if (this.properties.headerElement) {
                this.fadeInShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_TOP_HEIGHT, this.headerElement);
            } else {
                this.fadeInShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_TOP_HEIGHT, this.scrollBefore);
            }
            if (this.properties.footerElement) {
                this.fadeOutShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_BOTTOM_HEIGHT, this.footerElement);
            } else {
                this.fadeOutShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_BOTTOM_HEIGHT, this.scrollAfter);
            }
        } else if (this.scrollData.offsetBottom > 0) {
            // Set only bottom shadow
            if (this.properties.headerElement) {
                this.fadeOutShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_TOP_HEIGHT, this.headerElement);
            } else {
                this.fadeOutShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_TOP_HEIGHT, this.scrollBefore);
            }
            if (this.properties.footerElement) {
                this.fadeInShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_BOTTOM_HEIGHT, this.footerElement);
            } else {
                this.fadeInShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_BOTTOM_HEIGHT, this.scrollAfter);
            }
        } else {
            // Remove both shadows
            if (this.properties.headerElement) {
                this.fadeOutShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_TOP_HEIGHT, this.headerElement);
            } else {
                this.fadeOutShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_TOP_HEIGHT, this.scrollBefore);
            }
            if (this.properties.footerElement) {
                this.fadeOutShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_BOTTOM_HEIGHT, this.footerElement);
            } else {
                this.fadeOutShadow(PluginScrollShadow.CSS_VARIABLES.SHADOW_BOTTOM_HEIGHT, this.scrollAfter);
            }
        }
    }

    /**
     * Fade in animation method to shadows
     * @param {string} property
     * @param {HTMLElement} position
     */
    private fadeInShadow(property: string, position: HTMLElement) {
        if (parseInt(this.rootElement.style.getPropertyValue(property)) !== this.properties.height) {
            const propStyle: any = {};
            propStyle[property] = this.properties.height + 'px';
            UI.changeProperty(position, propStyle);
        }
    }

    /**
     * Fade out animation method to shadows
     * @param {string} property
     * @param {HTMLElement} position
     */
    private fadeOutShadow(property: string, position: HTMLElement) {
        if (parseInt(this.rootElement.style.getPropertyValue(property)) !== 0) {
            const propStyle: any = {};
            propStyle[property] = 0 + 'px';
            UI.changeProperty(position, propStyle);
        }
    }

    /**
     * Method to return if is mobile
     * @returns {boolean}
     */
    private isMobile() {
        return (window.innerWidth < this.properties.mobileBreakpoint);
    }

}
