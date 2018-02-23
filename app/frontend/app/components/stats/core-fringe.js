import Ember from 'ember';
import Component from '@ember/component';
import CoughDrop from '../../app';
import i18n from '../../utils/i18n';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  didInsertElement: function() {
    this.draw();
  },
  elem_class: function() {
    if(this.get('side_by_side')) {
      return htmlSafe('col-sm-6');
    } else {
      return htmlSafe('col-sm-4');
    }
  }.property('side_by_side'),
  elem_style: function() {
    if(this.get('right_side')) {
      return htmlSafe('border-left: 1px solid #eee;');
    } else {
      return htmlSafe('');
    }
  }.property('right_side'),
  draw: function() {
    var stats = this.get('usage_stats');
    var elem = this.get('element').getElementsByClassName('core_words')[0];

    CoughDrop.Visualizations.wait('pie-chart', function() {
      var parts = stats && (stats.get('modeling') ? stats.get('modeled_core_words') : stats.get('core_words'));
      if(elem && stats && parts) {
        var table = [
          ['Type', 'Instances']
        ];
        var slice_idx = 0;
        var slices = {};
        ['core', 'not_core'].forEach(function(key) {
          var str = key;
          if(str == 'not_core') { str = 'fringe'; }
          table.push([str, parts[key] || 0]);
          var color = '#ccc;';
          if(key == 'core') {
            color = '#49c7e8';
          } else if(key == 'not_core') {
            color = '#e5cea2';
          }
          slices[slice_idx] = {color: color};
          slice_idx++;
        });
        var data = window.google.visualization.arrayToDataTable(table);

        var options = {
          slices: slices,
          pieSliceTextStyle: {
            color: '#444'
          },
          chartArea: {
            left: 0,
            top: 0,
            width: '100%',
            height: '100%'
          },
          height: 300
        };


        var chart = new window.google.visualization.PieChart(elem);

        chart.draw(data, options);
      } else {
        elem.innerHTML = '';
      }
    });
  }.observes('usage_stats.draw_id', 'usage_stats.modeling')
});
