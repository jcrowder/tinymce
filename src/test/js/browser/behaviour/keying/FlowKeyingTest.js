asynctest(
  'Flow Keying Test',
 
  [
    'ephox.agar.api.FocusTools',
    'ephox.agar.api.Keyboard',
    'ephox.agar.api.Keys',
    'ephox.alloy.api.component.GuiFactory',
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Focusing',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.api.ui.Container',
    'ephox.alloy.construct.EventHandler',
    'ephox.alloy.test.GuiSetup',
    'ephox.alloy.test.NavigationUtils',
    'ephox.boulder.api.Objects',
    'ephox.compass.Arr'
  ],
 
  function (FocusTools, Keyboard, Keys, GuiFactory, Behaviour, Focusing, Keying, Container, EventHandler, GuiSetup, NavigationUtils, Objects, Arr) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    GuiSetup.setup(function (store, doc, body) {
      var item = function (classes, name) {
        return Container.build({
          dom: {
            tag: 'span',
            styles: {
              display: 'inline-block',
              width: '20px',
              height: '20px',
              margin: '2px',
              border: '1px solid ' + (Arr.contains(classes, 'stay') ? 'blue' : 'yellow')
            },
            classes: classes
          },
          events: {
            'alloy.execute': EventHandler.nu({
              run: store.adder('item.execute: ' + name)
            })
          },
          behaviours: Behaviour.derive([
            Focusing.config({ })
          ])
        });
      };

      return GuiFactory.build(
        Container.build({
          dom: {
            classes: [ 'flow-keying-test'],
            styles: {
              background: 'white',
              width: '200px',
              height: '200px'
            }
          },
          uid: 'custom-uid',
          behaviours: Behaviour.derive([
            Keying.config({
              mode: 'flow',
              selector: '.stay'
            })
          ]),
          components: [
            item([ 'stay', 'one' ], 'one'),
            item([ 'stay', 'two' ], 'two'),
            item([ 'skip', 'three' ], 'three'),
            item([ 'skip', 'four' ], 'four'),
            item([ 'stay', 'five' ], 'five')
          ]
        })
      );
    }, function (doc, body, gui, component, store) {

      var targets = {
        one: { label: 'one', selector: '.one' },
        two: { label: 'two', selector: '.two' },
        five: { label: 'five', selector: '.five' }
      };

      return [
        GuiSetup.mSetupKeyLogger(body),
        FocusTools.sSetFocus('Initial focus', gui.element(), '.one'),
        NavigationUtils.sequence(
          doc,
          Keys.right(),
          {},
          [
            targets.two,
            targets.five,
            targets.one,
            targets.two,
            targets.five,
            targets.one
          ]
        ),
        NavigationUtils.sequence(
          doc,
          Keys.left(),
          {  },
          [
            targets.five,
            targets.two,
            targets.one,
            targets.five,
            targets.two,
            targets.one
          ]
        ),
        NavigationUtils.sequence(
          doc,
          Keys.up(),
          {  },
          [
            targets.five,
            targets.two,
            targets.one,
            targets.five,
            targets.two,
            targets.one
          ]
        ),
        NavigationUtils.sequence(
          doc,
          Keys.down(),
          {  },
          [
            targets.two,
            targets.five,
            targets.one,
            targets.two,
            targets.five,
            targets.one
          ]
        ),

        // Test execute
        Keyboard.sKeydown(doc, Keys.enter(), {}),
        store.sAssertEq('Check that execute has fired on the right target', [ 'item.execute: one' ]),

        GuiSetup.mTeardownKeyLogger(body, [ ])
      ];
    }, function () {
      success();
    }, failure);
  }
);