asynctest(
  'TieredMenuTest',
 
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.Keyboard',
    'ephox.agar.api.Keys',
    'ephox.agar.api.Step',
    'ephox.alloy.api.component.GuiFactory',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.api.ui.Menu',
    'ephox.alloy.api.ui.TieredMenu',
    'ephox.alloy.construct.EventHandler',
    'ephox.alloy.menu.util.MenuEvents',
    'ephox.alloy.test.GuiSetup',
    'ephox.boulder.api.Objects'
  ],
 
  function (Assertions, Chain, Keyboard, Keys, Step, GuiFactory, SystemEvents, Keying, Menu, TieredMenu, EventHandler, MenuEvents, GuiSetup, Objects) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    GuiSetup.setup(function (store, doc, body) {
      return GuiFactory.build(
        TieredMenu.build({
          uid: 'uid-test-menu-1',
          value: 'test-menu-1',
          items: [
            { type: 'item', data: { value: 'alpha', text: 'Alpha' } },
            { type: 'item', data: { value: 'beta', text: 'Beta' } }
          ],
          dom: {
            tag: 'div',
            classes: [ 'test-menu' ]
          },
          components: [
            Menu.parts().items()
          ],

          markers: {
            item: 'test-item',
            selectedItem: 'test-selected-item',
            menu: 'test-menu',
            selectedMenu: 'test-selected-menu',
            backgroundMenu: 'test-background-menu'
          },
          members: { 
            item: {
              munge: function (itemSpec) {
                return {
                  dom: {
                    tag: 'div',
                    attributes: {
                      'data-value': itemSpec.data.value
                    },
                    classes: [ 'test-item' ],
                    innerHtml: itemSpec.data.text
                  },
                  components: [ ]
                };              
              }
            },
            menu: {
              munge: function (menuSpec) {
                return {
                  dom: {
                    tag: 'div',
                    attributes: {
                      'data-value': menuSpec.value
                    }
                  },
                  components: [ ],
                  shell: true
                };
              }
            }
          },

          data: {
            primary: 'menu-a',
            menus: {
              'menu-a': {
                value: 'menu-a',
                items: [
                  { type: 'item', data: { value: 'a-alpha', text: 'a-Alpha' }},
                  { type: 'item', data: { value: 'a-beta', text: 'a-Beta' }},
                  { type: 'item', data: { value: 'a-gamma', text: 'a-Gamma' }}
                ]
              },
              'menu-b': {
                value: 'menu-b',
                items: [
                  { type: 'item', data: { value: 'b-alpha', text: 'b-Alpha' } }
                ]
              }
            },
            expansions: {
              'a-beta': 'menu-b'
            }
          },

          events: Objects.wrap(
            MenuEvents.focus(),
            EventHandler.nu({
              run: store.adder('menu.events.focus')
            })
          ),

          onExecute: store.adderH('onExecute'),
          onEscape: store.adderH('onEscape'),
          onOpenMenu: store.adderH('onOpenMenu'),
          onOpenSubmenu: store.adderH('onOpenSubmenu')
        })
      );
    }, function (doc, body, gui, component, store) {
      // FIX: Flesh out test.
      var cAssertStructure = function (label, expected) {
        return Chain.op(function (element) {
          Assertions.assertStructure(label, expected, element);
        });
      };

      var cTriggerFocusItem = Chain.op(function (target) {
        component.getSystem().triggerEvent(SystemEvents.focusItem(), target, { });
      });

      var cAssertStore = function (label, expected) {
        return Chain.op(function () {
          store.assertEq(label, expected);
        });
      };

      var cClearStore = Chain.op(function () {
        store.clear();
      });

      return [
        Step.sync(function () {
          Keying.focusIn(component);
        }),
        Keyboard.sKeydown(doc, Keys.down(), { }),
        Keyboard.sKeydown(doc, Keys.right(), { })

        // TODO: Beef up tests
      ];
    }, function () { success(); }, failure);

  }
);