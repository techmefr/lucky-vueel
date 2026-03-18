export default defineAppConfig({
    ui: {
        button: {
            defaultVariants: {
                color: 'primary',
                variant: 'solid',
            },
        },
        input: {
            slots: {
                root: 'w-full',
            },
        },
    },
})
