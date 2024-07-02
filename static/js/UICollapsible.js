import { UIElement, UIDiv, UIButton } from "./ui.js";

class UICollapsible extends UIDiv {

    constructor( txt ) {

        super();
        this.button = new UIButton( txt );
        this.content = new UIDiv();
        this.initialize()

    }

    initialize() {

        const { button, content } = this;

        const onClick = () => {

            button.dom.classList.toggle("active"); // if active is set remove it, otherwise add it
            content.dom.style.maxHeight = content.dom.style.maxHeight ? null : content.dom.scrollHeight + "px";

        }

        button.onClick( onClick );
        button.setClass( 'collapsible' );
        content.setClass( 'content' );

        this.add( button, content );

    }

}

export { UICollapsible };
