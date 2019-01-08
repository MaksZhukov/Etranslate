import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import { checkItemsInLocalStorage, setItemsToLocalStorage } from './helpers';

const Welcome = () => import('./pages/Welcome.vue');
const NotFound = () => import('./pages/NotFound.vue');
const SignIn = () => import('./pages/SignIn.vue');
const SignUp = () => import('./pages/SignUp.vue');
const Dashboard = () => import('./pages/Dashboard.vue');
const Dictionary = () => import('./pages/Dictionary.vue');
const Recover = () => import('./pages/Recover.vue');
const EmailForRecover = () => import('./pages/EmailForRecover.vue');

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome,
    },
    {
      path: '/sign-in',
      name: 'signIn',
      component: SignIn,
      meta: {
        user: false,
      },
    },
    {
      path: '/sign-up',
      name: 'signUp',
      component: SignUp,
      meta: {
        user: false,
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        user: true,
      },
    },
    {
      path: '/dictionary',
      name: 'dictionary',
      component: Dictionary,
      meta: {
        user: true,
      },
    },
    {
      path: '/recover/:recoverToken',
      name: 'recover',
      component: Recover,
      meta: {
        user: false,
      },
      beforeEnter: async (to, from, next) => {
        await store.dispatch('userModule/checkRecoverToken', to.params.recoverToken);
        const { state: { userModule: { checkRecoverTokenResponse: { access } } } } = store;
        if (access) {
          next();
        } else {
          next('/sign-in');
        }
      },
    },
    {
      path: '/email-for-recover',
      name: 'emailForRecover',
      component: EmailForRecover,
      meta: {
        user: false,
      },
    },
    {
      path: '/404',
      name: '404',
      component: NotFound,
    },
    {
      path: '*',
      redirect: '/404',
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  let isTokensAndExpiresIn = checkItemsInLocalStorage(['refreshToken', 'accessToken', 'expiresIn']);
  if (to.path === '/' && !isTokensAndExpiresIn) {
    const { accessToken, refreshToken, expiresIn } = to.query;
    setItemsToLocalStorage({ accessToken, refreshToken, expiresIn });
    isTokensAndExpiresIn = true;
  }
  const { state: { userModule: { checkTokenResponse, user }, isLoad } } = store;
  let access;
  if (!isTokensAndExpiresIn && user !== null) {
    store.commit('userModule/logOut');
    return;
  }
  if (isTokensAndExpiresIn && localStorage.getItem('expiresIn') < (new Date().getTime() + 10000) / 1000) {
    await store.dispatch('userModule/updateTokens');
  }
  if (user && user.id) {
    access = true;
  } else if (Object.keys(checkTokenResponse).length === 0 && isTokensAndExpiresIn) {
    await store.dispatch('userModule/checkToken');
    access = true;
  }
  if (!isLoad) {
    store.commit('loaded');
  }
  if (to.meta.user && !access) {
    next('sign-in');
    return;
  }
  if (to.meta.user === false && access) {
    next(false);
    return;
  }
  next();
});

export default router;
