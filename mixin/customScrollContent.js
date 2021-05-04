import {mapGetters, mapState} from "vuex";

export default {
    methods: {
        scrollContentHeight: function () {
            let elementCardHeader = document.getElementById("d-card-header");
            let elementSub = document.querySelectorAll(".d-element-fixed-for-sub");
            let elementCardFooter = document.getElementById("d-nav-bottom");
            let bodyContentScroll = document.getElementById("body-content-scroll");
            if (!bodyContentScroll) {
                return;
            }
            let totalArraySub = [...elementSub].map(ele => ele.offsetHeight).reduce(function(a, b) { return a + b; }, 0);

            let elementCardHeaderHeight = elementCardHeader ? elementCardHeader.offsetHeight : 0;
            let elementCardFooterHeight = elementCardFooter ? elementCardFooter.offsetHeight : 0;

            if (bodyContentScroll) {
                // let style = `margin-bottom: ${elementCardFooterHeight}px;`
                let style = `height: ${window.innerHeight - elementCardFooterHeight - elementCardHeaderHeight - totalArraySub}px;`
                bodyContentScroll.setAttribute("style", style);
            }

            this.$store.dispatch('customScrollContentHeightDispatch', (window.innerHeight - elementCardHeaderHeight - elementCardFooterHeight));
        },
        onresize(event) {
            let self = this;
            setTimeout(() => {
                self.scrollContentHeight(event)
            }, 0)
        },
    },
    mounted() {
        let self = this;
        self.scrollContentHeight();

        let config = {attributes: true, childList: true, subtree: true};
        // Callback function to execute when mutations are observed
        let callback = function (mutationsList, observer) {
            self.$nextTick(() => {
                self.scrollContentHeight();
            })
        };

        let observer = new MutationObserver(callback);
        let targetNodeHeader = document.getElementById('d-card-header');
        let targetNodeBottom = document.getElementById('d-nav-bottom');

        if (targetNodeHeader) {
            observer.observe(targetNodeHeader, config)
        }
        if (targetNodeBottom) {
            observer.observe(targetNodeBottom, config)
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            customScrollContentHeight: state => state.main.customScrollContentHeight,
        }),
        ...mapGetters({
            customScrollContentHeight: "customScrollContentHeight",
        })
    },
    created() {
        let self = this;

        window.addEventListener('resize', self.onresize);
    }
}
