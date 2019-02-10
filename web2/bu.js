// URL: https://beta.observablehq.com/@robinl/population-estimates-using-the-filter-api
// Title: ${wcsv_meta["dct:title"]}
// Author: Robin Linacre (@robinl)
// Version: 218
// Runtime version: 1

const m0 = {
  id: "848ce31436dddc5d@218",
  variables: [
    {
      name: "title",
      inputs: ["md","wcsv_meta"],
      value: (function(md,wcsv_meta){return(
md `## ${wcsv_meta["dct:title"]}`
)})
    },
    {
      name: "viewof selected_granularity",
      inputs: ["select"],
      value: (function(select){return(
select({
  title: "Please select width of age bands:",
  options: [1,2,5,10],
  value: 5
})
)})
    },
    {
      name: "selected_granularity",
      inputs: ["Generators","viewof selected_granularity"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof selected_year",
      inputs: ["select","times"],
      value: (function(select,times){return(
select({
  title: "Please select year",
  options: times["options"],
  value: "2017"
})
)})
    },
    {
      name: "selected_year",
      inputs: ["Generators","viewof selected_year"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof selected_geography",
      inputs: ["select","geographies"],
      value: (function(select,geographies){return(
select({
  title: "Please select geography",
  options: geographies["options"],
  value: "Hartlepool"
})
)})
    },
    {
      name: "selected_geography",
      inputs: ["Generators","viewof selected_geography"],
      value: (G, _) => G.input(_)
    },
    {
      name: "commentary",
      inputs: ["md","selected_geography","selected_year","d3","total_population"],
      value: (function(md,selected_geography,selected_year,d3,total_population){return(
md`The total population for ${selected_geography} in ${selected_year} was ${d3.format(",.0f")(total_population)}`
)})
    },
    {
      name: "pyramid",
      inputs: ["vega_embed","spec"],
      value: (function(vega_embed,spec){return(
vega_embed(spec)
)})
    },
    {
      name: "description",
      inputs: ["md","wcsv_meta"],
      value: (function(md,wcsv_meta){return(
md `${wcsv_meta["dct:description"]}`
)})
    },
    {
      name: "details",
      inputs: ["md","wcsv_meta"],
      value: (function(md,wcsv_meta){return(
md `Dataset issued ${Date(wcsv_meta["dct:issued"]).toString()}, contact ${wcsv_meta["dcat:contactPoint"][0]["vcard:email"]} for further details.  This is an ${wcsv_meta["dct:accrualPeriodicity"]} published dataset.`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Workings`
)})
    },
    {
      name: "total_population",
      inputs: ["_","df","selected_geography","selected_year"],
      value: (function(_,df,selected_geography,selected_year){return(
_.sumBy(_.filter(df, d=> (d["geography"] == selected_geography && d["time"] == selected_year)), d=>d["V4_0"])
)})
    },
    {
      name: "spec",
      inputs: ["selected_granularity","selected_geography","selected_year","df_for_chart"],
      value: (function(selected_granularity,selected_geography,selected_year,df_for_chart)
{
  return {
    $schema: 'https://vega.github.io/schema/vega/v4.json',
    height: 1000/selected_granularity,
    padding: 5,
    signals: [{
        name: 'chartWidth',
        value: 300
    }, {
        name: 'chartPad',
        value: 20
    }, {
        name: 'width',
        update: '2 * chartWidth + chartPad'
    }
    ],
    title: {
        text: 'Population pyramid for ' + selected_geography + " in " + selected_year,
        anchor: 'start'
    },
    data: [{
        name: 'population',
        values: df_for_chart
    }, {
        name: 'popBinned',
        source: 'population',
        transform: [{
            type: 'bin',
            field: 'age',
            extent: [
                0,
                120
            ],
            step: selected_granularity,
            nice: true
        }, {
            type: 'aggregate',
            groupby: ['time', 'geography', 'sex', 'bin0'],
            ops: ['sum'],
            fields: ['V4_0']
        }]
    }, {
        name: 'popFiltered',
        source: 'popBinned',
        transform: [{
            type: 'filter',
            expr: 'datum.time == ' + selected_year
        },
                   {
            type: 'filter',
            expr: 'datum.geography == \''  + selected_geography + '\''
        }]
    }, {
        name: 'females',
        source: 'popFiltered',
        transform: [{
            type: 'filter',
            expr: 'datum.sex == \'Female\''
        }]
    }, {
        name: 'males',
        source: 'popFiltered',
        transform: [{
            type: 'filter',
            expr: 'datum.sex == \'Male\''
        }]
    }],
    scales: [{
        name: 'y',
        type: 'band',
        range: [{
                signal: 'height'
            },
            0
        ],
        round: true,
        domain: {
            data: 'popBinned',
            field: 'bin0',
            sort: true
        }
    }, {
        name: 'c',
        type: 'ordinal',
        domain: ['Male', 'Female'],
        range: ['#1f77b4', '#e377c2']
    }],
    marks: [{
        type: 'text',
        interactive: false,
        from: {
            data: 'popFiltered'
        },
        encode: {
            enter: {
                x: {
                    signal: 'chartWidth + chartPad / 2'
                },
                y: {
                    scale: 'y',
                    field: 'bin0',
                    band: 0.5
                },
                text: {
                    field: 'bin0'
                },
                baseline: {
                    value: 'middle'
                },
                align: {
                    value: 'center'
                },
                fill: {
                    value: '#000'
                }
            }
        }
    }, {
        type: 'group',
        encode: {
            update: {
                x: {
                    value: 0
                },
                height: {
                    signal: 'height'
                }
            }
        },
        scales: [{
            name: 'x',
            type: 'linear',
            range: [{
                    signal: 'chartWidth'
                },
                0
            ],
            nice: true,
            zero: true,
            domain: {
                data: 'popFiltered',
                field: 'sum_V4_0'
            }
        }],
        axes: [{
            orient: 'bottom',
            scale: 'x',
            format: 's'
        }],
        marks: [{
            type: 'rect',
            from: {
                data: 'females'
            },
            encode: {
                enter: {
                    x: {
                        scale: 'x',
                        field: 'sum_V4_0'
                    },
                    x2: {
                        scale: 'x',
                        value: 0
                    },
                    y: {
                        scale: 'y',
                        field: 'bin0'
                    },
                    height: {
                        scale: 'y',
                        band: 1,
                        offset: -1
                    },
                    fillOpacity: {
                        value: 0.6
                    },
                    fill: {
                        scale: 'c',
                        field: 'sex'
                    }
                }
            }
        }]
    }, {
        type: 'group',
        encode: {
            update: {
                x: {
                    signal: 'chartWidth + chartPad'
                },
                height: {
                    signal: 'height'
                }
            }
        },
        scales: [{
            name: 'x',
            type: 'linear',
            range: [
                0, {
                    signal: 'chartWidth'
                }
            ],
            nice: true,
            zero: true,
            domain: {
                data: 'popFiltered',
                field: 'sum_V4_0'
            }
        }],
        axes: [{
            orient: 'bottom',
            scale: 'x',
            format: 's'
        }],
        marks: [{
            type: 'rect',
            from: {
                data: 'males'
            },
            encode: {
                enter: {
                    x: {
                        scale: 'x',
                        field: 'sum_V4_0'
                    },
                    x2: {
                        scale: 'x',
                        value: 0
                    },
                    y: {
                        scale: 'y',
                        field: 'bin0'
                    },
                    height: {
                        scale: 'y',
                        band: 1,
                        offset: -1
                    },
                    fillOpacity: {
                        value: 0.6
                    },
                    fill: {
                        scale: 'c',
                        field: 'sex'
                    }
                }
            }
        }]
    }]
}}
)
    },
    {
      name: "post",
      inputs: ["times","selected_year","geographies","selected_geography"],
      value: (function(times,selected_year,geographies,selected_geography){return(
{
  dataset: {
    id: 'mid-year-pop-est',
    edition: 'time-series',
    version: 4
  },
  dimensions: [
    {
      name: 'sex',
      options: [
        '1',
        '2'
      ]
    },
    {
      name: 'time',
      options: [times["lookup"][selected_year]["option"]]
    },
    {
      name: 'geography',
      options: [geographies["lookup"][selected_geography]["option"]]
    },
    {name: 'age',
    options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', "90+"]}
    ]
}
)})
    },
    {
      name: "create_filter",
      inputs: ["post"],
      value: (function(post)
{
  const domain = "https://api.beta.ons.gov.uk"
   return fetch(domain + '/v1/filters?submitted=true', {
            mode: 'cors',
            method: 'post',
            body: JSON.stringify(post)
        })
}
)
    },
    {
      name: "filter_json",
      inputs: ["create_filter"],
      value: (function(create_filter){return(
create_filter.json()
)})
    },
    {
      name: "download_href",
      inputs: ["filter_json"],
      value: (async function(filter_json)
{
  let filter_output = filter_json.links.filter_output.href
  let download_href = filter_output.replace("https://api.beta.ons.gov.uk/v1/", "https://download.beta.ons.gov.uk/downloads/") + ".csv"
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return download_href

  
}
)
    },
    {
      name: "df",
      inputs: ["d3","download_href"],
      value: (function(d3,download_href){return(
d3.csv(download_href, d3.autoType)
)})
    },
    {
      name: "df_for_chart",
      inputs: ["_","df"],
      value: (function(_,df)
{
return   _.filter(df, d => d.age != "90+")
}
)
    },
    {
      name: "geography_options_raw",
      inputs: ["d3"],
      value: (function(d3){return(
d3.json("https://api.beta.ons.gov.uk/v1/datasets/mid-year-pop-est/editions/time-series/versions/4/dimensions/geography/options")
)})
    },
    {
      name: "time_options_raw",
      inputs: ["d3"],
      value: (function(d3){return(
d3.json("https://api.beta.ons.gov.uk/v1/datasets/mid-year-pop-est/editions/time-series/versions/4/dimensions/time/options")
)})
    },
    {
      name: "geographies",
      inputs: ["_","geography_options_raw"],
      value: (function(_,geography_options_raw)
{
let return_dict = {}
return_dict["lookup"] = _.keyBy(geography_options_raw["items"], "label")
return_dict["options"] = _.map(geography_options_raw["items"], d => `${d["label"]}`)
return return_dict
}
)
    },
    {
      name: "times",
      inputs: ["_","time_options_raw"],
      value: (function(_,time_options_raw)
{
let return_dict = {}
return_dict["lookup"] = _.keyBy(time_options_raw["items"], "label")
return_dict["options"] = _.map(time_options_raw["items"], d => `${d["label"]}`)
return return_dict
}
)
    },
    {
      name: "wcsv_meta",
      inputs: ["d3"],
      value: (function(d3){return(
d3.json("https://download.beta.ons.gov.uk/downloads/datasets/mid-year-pop-est/editions/time-series/versions/4.csv-metadata.json")
)})
    },
    {
      from: "@jashkenas/inputs",
      name: "radio",
      remote: "radio"
    },
    {
      from: "@jashkenas/inputs",
      name: "slider",
      remote: "slider"
    },
    {
      from: "@jashkenas/inputs",
      name: "checkbox",
      remote: "checkbox"
    },
    {
      from: "@jashkenas/inputs",
      name: "select",
      remote: "select"
    },
    {
      name: "vega_embed",
      inputs: ["require"],
      value: (function(require){return(
require("vega-embed")
)})
    },
    {
      name: "_",
      inputs: ["require"],
      value: (function(require){return(
require("lodash")
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("d3@^5.9")
)})
    }
  ]
};

const m1 = {
  id: "@jashkenas/inputs",
  variables: [
    {
      name: "radio",
      inputs: ["input","html"],
      value: (function(input,html){return(
function radio(config = {}) {
  let { value: formValue, title, description, submit, options } = config;
  if (Array.isArray(config)) options = config;
  options = options.map(
    o => (typeof o === "string" ? { value: o, label: o } : o)
  );
  const form = input({
    type: "radio",
    title,
    description,
    submit,
    getValue: input => {
      const checked = Array.prototype.find.call(input, radio => radio.checked);
      return checked ? checked.value : undefined;
    },
    form: html`
      <form>
        ${options.map(({ value, label }) => {
          const input = html`<input type=radio name=input ${
            value === formValue ? "checked" : ""
          } style="vertical-align: baseline;" />`;
          input.setAttribute("value", value);
          const tag = html`
          <label style="display: inline-block; margin: 5px 10px 3px 0; font-size: 0.85em;">
           ${input}
           ${label}
          </label>`;
          return tag;
        })}
      </form>
    `
  });
  form.output.remove();
  return form;
}
)})
    },
    {
      name: "slider",
      inputs: ["input"],
      value: (function(input){return(
function slider(config = {}) {
  let {value, min = 0, max = 1, step = "any", precision = 2, title, description, getValue, format, display, submit} = config;
  if (typeof config == "number") value = config;
  if (value == null) value = (max + min) / 2;
  precision = Math.pow(10, precision);
  if (!getValue) getValue = input => Math.round(input.valueAsNumber * precision) / precision;
  return input({
    type: "range", title, description, submit, format, display,
    attributes: {min, max, step, value},
    getValue
  });
}
)})
    },
    {
      name: "checkbox",
      inputs: ["input","html"],
      value: (function(input,html){return(
function checkbox(config = {}) {
  let { value: formValue, title, description, submit, options } = config;
  if (Array.isArray(config)) options = config;
  options = options.map(
    o => (typeof o === "string" ? { value: o, label: o } : o)
  );
  const form = input({
    type: "checkbox",
    title,
    description,
    submit,
    getValue: input => {
      if (input.length)
        return Array.prototype.filter
          .call(input, i => i.checked)
          .map(i => i.value);
      return input.checked ? input.value : false;
    },
    form: html`
      <form>
        ${options.map(({ value, label }) => {
          const input = html`<input type=checkbox name=input ${
            (formValue || []).indexOf(value) > -1 ? "checked" : ""
          } style="vertical-align: baseline;" />`;
          input.setAttribute("value", value);
          const tag = html`<label style="display: inline-block; margin: 5px 10px 3px 0; font-size: 0.85em;">
           ${input}
           ${label}
          </label>`;
          return tag;
        })}
      </form>
    `
  });
  form.output.remove();
  return form;
}
)})
    },
    {
      name: "select",
      inputs: ["input","html"],
      value: (function(input,html){return(
function select(config = {}) {
  let {
    value: formValue,
    title,
    description,
    submit,
    multiple,
    size,
    options
  } = config;
  if (Array.isArray(config)) options = config;
  options = options.map(
    o => (typeof o === "object" ? o : { value: o, label: o })
  );
  const form = input({
    type: "select",
    title,
    description,
    submit,
    getValue: input => {
      const selected = Array.prototype.filter
        .call(input.options, i => i.selected)
        .map(i => i.value);
      return multiple ? selected : selected[0];
    },
    form: html`
      <form>
        <select name="input" ${
          multiple ? `multiple size="${size || options.length}"` : ""
        }>
          ${options.map(({ value, label }) => Object.assign(html`<option>`, {
              value,
              selected: Array.isArray(formValue)
                ? formValue.includes(value)
                : formValue === value,
              textContent: label
            }))}
        </select>
      </form>
    `
  });
  form.output.remove();
  return form;
}
)})
    },
    {
      name: "input",
      inputs: ["html","d3format"],
      value: (function(html,d3format){return(
function input(config) {
  let {
    form,
    type = "text",
    attributes = {},
    action,
    getValue,
    title,
    description,
    format,
    display,
    submit,
    options
  } = config;
  if (!form)
    form = html`<form>
	<input name=input type=${type} />
  </form>`;
  const input = form.input;
  Object.keys(attributes).forEach(key => {
    const val = attributes[key];
    if (val != null) input.setAttribute(key, val);
  });
  if (submit)
    form.append(
      html`<input name=submit type=submit style="margin: 0 0.75em" value="${
        typeof submit == "string" ? submit : "Submit"
      }" />`
    );
  form.append(
    html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`
  );
  if (title)
    form.prepend(
      html`<div style="font: 700 0.9rem sans-serif;">${title}</div>`
    );
  if (description)
    form.append(
      html`<div style="font-size: 0.85rem; font-style: italic;">${description}</div>`
    );
  if (format) format = d3format.format(format);
  if (action) {
    action(form);
  } else {
    const verb = submit
      ? "onsubmit"
      : type == "button"
        ? "onclick"
        : type == "checkbox" || type == "radio"
          ? "onchange"
          : "oninput";
    form[verb] = e => {
      e && e.preventDefault();
      const value = getValue ? getValue(input) : input.value;
      if (form.output)
        form.output.value = display
          ? display(value)
          : format
            ? format(value)
            : value;
      form.value = value;
      if (verb !== "oninput")
        form.dispatchEvent(new CustomEvent("input", { bubbles: true }));
    };
    if (verb !== "oninput")
      input.oninput = e => e && e.stopPropagation() && e.preventDefault();
    if (verb !== "onsubmit") form.onsubmit = e => e && e.preventDefault();
    form[verb]();
  }
  return form;
}
)})
    },
    {
      name: "d3format",
      inputs: ["require"],
      value: (function(require){return(
require("d3-format")
)})
    }
  ]
};

const notebook = {
  id: "848ce31436dddc5d@218",
  modules: [m0,m1]
};

export default notebook;
