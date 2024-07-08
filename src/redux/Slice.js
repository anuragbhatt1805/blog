import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: {
        name: 'Anurag Bhatt',
        username: 'bhatt3923',
        email: 'program.anurag@gmail.com',
        avatar: 'https://avatars.githubusercontent.com/u/72703824?v=4',
        follower: ['raunakdob', 'saurabhdaware', 'shubhamdaware', 'saurabhchavan'],
        following: ['raunakdob', 'saurabhdaware', 'shubhamdaware', 'saurabhchavan'],
        bio: 'I am a full stack developer and I love to code.',
        location: 'India',
        urls: {
            github: 'https://github.com/anuragbhatt1805/',
            instagram: 'https://www.instagram.com/anuragbhatt1805/',
            linkedin: 'https://www.linkedin.com/in/anurag-bhatt-1805/',
            twitter: 'https://twitter.com/AnuragBhatt1805',
            facebook: 'https://www.facebook.com/anuragbhatt1805/'
        },
        blog: [
            {
                id: 1,
                title: 'How to create a blog using React',
                image: 'https://media.istockphoto.com/id/874849032/photo/social-connecting-in-smart-city-at-night.jpg?s=1024x1024&w=is&k=20&c=ZkjYJMa41Nd6ccwD1V90fwlBY7oCq_QNNuH2u-zn1e8=',
                description: 'This is a blog post on how to create a blog using React. React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.',
            },
            {
                id: 2,
                title: 'How to create a blog using Angular',
                image: 'https://media.istockphoto.com/id/874849032/photo/social-connecting-in-smart-city-at-night.jpg?s=1024x1024&w=is&k=20&c=ZkjYJMa41Nd6ccwD1V90fwlBY7oCq_QNNuH2u-zn1e8=',
                description: 'This is a blog post on how to create a blog using Angular. Angular is a platform and framework for building single-page client applications using HTML and TypeScript. Angular is written in TypeScript.',
            },
            {
                id: 3,
                title: 'How to create a blog using Vue',
                image: 'https://media.istockphoto.com/id/874849032/photo/social-connecting-in-smart-city-at-night.jpg?s=1024x1024&w=is&k=20&c=ZkjYJMa41Nd6ccwD1V90fwlBY7oCq_QNNuH2u-zn1e8=',
                description: 'This is a blog post on how to create a blog using Vue. Vue.js is an open-source model–view–viewmodel front end JavaScript framework for building user interfaces and single-page applications.',
            },
            {
                id: 4,
                title: 'How to create a blog using Svelte',
                image: 'https://media.istockphoto.com/id/874849032/photo/social-connecting-in-smart-city-at-night.jpg?s=1024x1024&w=is&k=20&c=ZkjYJMa41Nd6ccwD1V90fwlBY7oCq_QNNuH2u-zn1e8=',
                description: 'This is a blog post on how to create a blog using Svelte. Svelte is a free and open-source front end JavaScript framework that allows you to write less code to create highly efficient web applications.',
            }
        ],
    }
}


const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            const { username, password } = action.payload
            if (!username || !password) {
                state.user = {}
            } else {
                state.user = {
                    ...state.user,
                    access_token: 'access',
                    refresh_token: 'refresh'
                }
                localStorage.setItem('access_token', state.user.access_token)
                localStorage.setItem('refresh_token', state.user.refresh_token)
            }
        },
        fetchUser : (state, action) => {
            const token = localStorage.getItem('access_token')
            if (!token) {
                state.user = {}
            } else {
                state.user = initialState.user
                state.user = {
                    ...state.user,
                    access_token: 'token'
                }
            }
        },
        logout: (state, action) => {
            state.user = {}
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
        }
    }
})


export const {login, fetchUser, logout} = slice.actions

export default slice.reducer

export {
    initialState
}