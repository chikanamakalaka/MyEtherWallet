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
    content-size="large"
    :show-overlay="open"
    :title="title"
    :back="showBackBtn ? accessBack : null"
    :close="close"
  >
    <!--
    =====================================================================================
      Overview: prompts user to select options
    =====================================================================================
    -->
    <v-row v-if="walletType === types.OVERVIEW">
      <v-col v-for="(btn, key) in buttons" :key="key" cols="12" sm="12">
        <mew-super-button
          font-class="mew-heading-2"
          btn-mode="small-right-image"
          :title="btn.label"
          :subtitle="btn.description"
          :right-icon="btn.icon"
          right-icon-type="mew"
          color-theme="basic"
          @click.native="btn.fn"
        />
      </v-col>
    </v-row>
    <!--
    =====================================================================================
      Access With Keystore
    =====================================================================================
    -->
    <access-wallet-keystore
      v-if="walletType === types.KEYSTORE"
      :handler-access-wallet="accessHandler"
      @unlock="unlockWallet"
    />
    <!--
    =====================================================================================
      Access With Mnemonic
    =====================================================================================
    -->
    <access-wallet-mnemonic
      v-if="walletType === types.MNEMONIC"
      :handler-access-wallet="accessHandler"
      @unlock="unlockWallet"
    />
    <!--
    =====================================================================================
      Access With PrivateKey
    =====================================================================================
    -->
    <access-wallet-private-key
      v-else-if="walletType === types.PRIVATE_KEY"
      :handler-access-wallet="accessHandler"
      @unlock="unlockWallet"
    />
    <!--
    =====================================================================================
      Warning
    =====================================================================================
    -->
    <mew-warning-sheet
      title="Not Recommended"
      description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users."
      :link-obj="warningSheetObj"
      class="mt-6 mb-0"
    />
  </mew-overlay>
</template>

<script>
import AccessWalletKeystore from './software/components/AccessWalletKeystore';
import AccessWalletMnemonic from './software/components/AccessWalletMnemonic';
import AccessWalletPrivateKey from './software/components/AccessWalletPrivateKey';
import { mapActions, mapState } from 'vuex';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { SOFTWARE_WALLET_TYPES } from './software/handlers/helpers';
import handlerAccessWalletSoftware from './software/handlers/handlerAccessWalletSoftware';
import { ROUTES_WALLET } from '../../core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

export default {
  name: 'ModuleAccessWalletSoftware',
  components: {
    AccessWalletKeystore,
    AccessWalletMnemonic,
    AccessWalletPrivateKey
  },
  mixins: [handlerAnalytics],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    close: {
      type: Function,
      default: () => {}
    },
    walletType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      type: '',
      types: SOFTWARE_WALLET_TYPES,
      warningSheetObj: {
        title: 'Learn More',
        url: 'https://help.myetherwallet.com/en/articles/5380611-using-mew-offline-cold-storage'
      },
      buttons: [
        /* Keystore Button */
        {
          label: 'Keystore',
          icon: 'keystore',
          fn: () => {
            this.setType(SOFTWARE_WALLET_TYPES.KEYSTORE);
          }
        },
        /* Mnemonic */
        {
          label: 'Mnemonic Phrase',
          icon: 'mnemonic',
          fn: () => {
            this.setType(SOFTWARE_WALLET_TYPES.MNEMONIC);
          }
        },
        /* Private Key */
        {
          label: 'Private Key',
          icon: 'privateKey',
          fn: () => {
            if (process.env.VUE_APP_PRIV_KEY) {
              this.accessHandler.unlockPrivateKeyWallet(
                process.env.VUE_APP_PRIV_KEY
              );
              this.unlockWallet();
            } else {
              this.setType(SOFTWARE_WALLET_TYPES.PRIVATE_KEY);
            }
          }
        }
      ],
      accessHandler: {}
    };
  },

  computed: {
    /**
     * @returns if the back button on overlay should be displayed
     */
    showBackBtn() {
      return this.walletType !== SOFTWARE_WALLET_TYPES.OVERVIEW;
    },
    /**
     * @returns correct title of the overlay according to the wallet type selected
     */
    title() {
      switch (this.walletType) {
        case SOFTWARE_WALLET_TYPES.KEYSTORE:
          return 'Access Wallet with Keystore File';
        case SOFTWARE_WALLET_TYPES.MNEMONIC:
          return 'Access Wallet with Mnemonic Phrase';
        case SOFTWARE_WALLET_TYPES.PRIVATE_KEY:
          return 'Access Wallet with Private Key';
        default:
          return 'Select Software Wallet';
      }
    },
    ...mapState('external', ['path'])
  },
  /**
   * Lifecucle hooks to create and destroy access wallet handler
   */
  mounted() {
    this.accessHandler = new handlerAccessWalletSoftware();
  },
  destroyed() {
    this.accessHandler = {};
  },
  methods: {
    /**
     * Sets Wallet in the store
     */
    ...mapActions('wallet', ['setWallet']),

    /**
     * Sets Wallet and Pushes new route query param
     * Used in overlay back button
     * account is defined in Mnemonic phrase access
     */
    unlockWallet(account = undefined) {
      try {
        const wallet = !account
          ? this.accessHandler.getWalletInstance()
          : account;
        this.setWallet([wallet])
          .then(() => {
            if (this.path !== '') {
              this.$router.push({ path: this.path });
            } else {
              this.$router.push({ name: ROUTES_WALLET.WALLETS.NAME });
            }
            this.trackAccessWallet(this.type);
          })
          .catch(e => {
            Toast(e, {}, ERROR);
          });
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },

    /**
     * Directs user back to software overview
     * Pushes new route query param
     * Used in overlay back button
     */
    accessBack() {
      if (this.walletType !== SOFTWARE_WALLET_TYPES.OVERVIEW) {
        try {
          this.$router.push({
            query: { type: SOFTWARE_WALLET_TYPES.OVERVIEW }
          });
        } catch (e) {
          Toast(e, {}, ERROR);
        }
      }
    },

    /**
     * Sets a wallet type, pushes new route
     * This method is used in create overview block
     * @type - must be one of the SOFTWARE_WALLET_TYPES
     */
    setType(newType) {
      if (Object.values(SOFTWARE_WALLET_TYPES).includes(newType)) {
        try {
          this.type = newType;
          this.$router.push({
            query: { type: newType }
          });
        } catch (e) {
          Toast(e, {}, ERROR);
        }
      } else {
        throw new Error('Not a valid type!');
      }
    }
  }
};
</script>
