<template>
  <!--
  =====================================================================================
    Overlay - access using software
  =====================================================================================
  -->
  <mew-overlay
    :footer="{
      text: 'Need help?',
      linkTitle: 'Contact support',
      link: 'mailto:support@myetherwallet.com'
    }"
    :show-overlay="open"
    title="Access Wallet with Mobile Apps"
    content-size="large"
    :close="close"
  >
    <!--
    =====================================================================================
      Mobile Connection Protocol Buttons
    =====================================================================================
    -->
    <v-row>
      <v-col v-for="(btn, key) in buttons" :key="key" cols="12">
        <mew-super-button
          font-class="mew-heading-2"
          :title="btn.label"
          :subtitle="btn.description"
          color-theme="basic"
          @click.native="btn.fn"
        >
          <template #contentSlot>
            <v-img
              :src="btn.icon"
              max-width="90px"
              min-width="40px"
              class="px-4 px-sm-3"
              contain
            />
          </template>
        </mew-super-button>
      </v-col>
    </v-row>
  </mew-overlay>
</template>

<script>
import { Toast, SENTRY } from '@/modules/toast/handler/handlerToast';
import {
  WalletConnectWallet,
  WalletLinkWallet
} from '@/modules/access-wallet/hybrid/handlers';
import { mapActions } from 'vuex';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import WALLET_TYPES from './common/walletTypes';

export default {
  name: 'ModuleAccessWalletMobile',
  mixins: [handlerAnalytics],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    close: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      buttons: [
        {
          label: 'WalletConnect',
          icon: require('@/assets/images/icons/icon-wallet-connect.svg'),
          fn: () => {
            this.openWalletConnect();
          }
        },
        {
          label: 'WalletLink',
          icon: require('@/assets/images/icons/icon-wallet-link.png'),
          fn: () => {
            this.openWalletLink();
          }
        }
      ]
    };
  },
  methods: {
    ...mapActions('wallet', ['setWallet']),
    openWalletConnect() {
      try {
        WalletConnectWallet()
          .then(_newWallet => {
            this.setWallet([_newWallet]).then(() => {
              this.trackAccessWallet(WALLET_TYPES.WALLET_CONNECT);
              this.$router.push({ name: ROUTES_WALLET.DASHBOARD.NAME });
            });
          })
          .catch(e => {
            WalletConnectWallet.errorHandler(e);
          });
      } catch (e) {
        Toast(e.message, {}, SENTRY);
      }
    },
    openWalletLink() {
      try {
        WalletLinkWallet()
          .then(_newWallet => {
            this.setWallet([_newWallet]).then(() => {
              this.trackAccessWallet(WALLET_TYPES.WALLET_LINK);
              this.$router.push({ name: ROUTES_WALLET.DASHBOARD.NAME });
            });
          })
          .catch(e => {
            WalletLinkWallet.errorHandler(e);
          });
      } catch (e) {
        Toast(e.message, {}, SENTRY);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
