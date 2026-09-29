import { SearchSubsets } from "../utils/SearchSubsets"
import { isBlank } from "../utils/helpers"
import { hasQuoties, extractQuotiesFromSearchbox, pullQuotedClauses } from "../utils/searchHelpers"
import * as QueryHelpers from "../utils/queryHelpers"

export default function originalSearch(customQuery, search_attributes, searchSet){
  var queryHash

  var title_if_present
  if(customQuery.title && customQuery.title.length > 0){
    title_if_present = customQuery.title
  }

  var mainBoxQuoties
  if(hasQuoties(customQuery.query)){
    var mainBox = extractQuotiesFromSearchbox(customQuery.query)
    query = mainBox.query
    mainBoxQuoties = mainBox.quoties
  }

  // is query empty now ?
  let emptyQuery = isBlank(customQuery.query)
  
  var mainAllFieldsArray = QueryHelpers.allFieldsArray(customQuery.query)

  if(emptyQuery){

    // console.log( 'it aint no query' )
    // there *is not* a main box query

    queryHash = {
      // top bool
      bool: {
        // big should
        // should: []
        // disabled because if you add "quoted terms" there will be a big clause that matches nothing in :should, blocking the :must clause from matching
        // minimum_should_match: 1
      }
    }

  } else {
    // there *is* a main box query
    queryHash = {
      // original

      // top bool
      bool: {
        // big should
        should: [
          {
            bool: {
              should: mainAllFieldsArray,
              // minimum_should_match: 1
            }
          }
        ]
      }
    }
  }

  // add in clauses for each of 3 secondary searchbox fields
  var allBox, allBoxQuoties
  if(customQuery.all && customQuery.all.length > 0){

    // lets get crazy
    var allBoxQueryString = customQuery.all
    if( hasQuoties(allBoxQueryString) ){
      // quoty me on that
      
      // we're modifying the actual value of the main query here (to remove quoties) so don't store the altered state in customQuery
       allBox = extractQuotiesFromSearchbox(allBoxQueryString)
       allBoxQueryString = allBox.query
       allBoxQuoties = allBox.quoties
      // add appropriate quoty search clauses to bool down at the end
    }

    // whether query was modified or not, go ahead and do nonquoty all query v

    // add second big should clause to outer bool query's must clause
    var allQuery
    if(allBoxQueryString && allBoxQueryString.length > 0 && !isBlank(allBoxQueryString)){
      // only add the regular query for allbox IF there remains a NONQUOTY allbox query

      allQuery = {
        bool: {
          should: QueryHelpers.allFieldsArray( allBoxQueryString, searchSet ),
          // allbox query should ALWAYS have min match one on ITS OWN BOOL, because doc doesnt match unless allboxquery appears in at least one field!
          minimum_should_match: 1
        }
      }

      // adding 'all' box query to outer bool here
      queryHash.bool.must ||= []
      queryHash.bool.must.push(allQuery)
    }
  }

  var noneBox, noneBoxQuoties
  if(customQuery.none && customQuery.none.length > 0){
    
    // lets get noney
    var noneBoxQueryString = customQuery.none        
    if( hasQuoties(noneBoxQueryString) ){
      
      // we're modifying the actual value of the none query here (to remove quoties) so don't store the altered state in customQuery
      noneBox = extractQuotiesFromSearchbox(noneBoxQueryString)
      noneBoxQueryString = noneBox.query
      noneBoxQuoties = noneBox.quoties

      // add appropriate quoty search clauses to bool down at the end
    }

    queryHash.bool.must_not ||= []

    // add must_not clause to big bool
    if(noneBoxQueryString && noneBoxQueryString.length > 0){
      // only add it IF there remains a NONQUOTY nonebox query
      queryHash.bool.must_not.push( QueryHelpers.allFieldsTermQuery(noneBoxQueryString, searchSet) )
    }

    if(noneBoxQuoties && noneBoxQuoties.length > 0){
      // now also add our quoty clauses to must_not
      noneBoxQuoties.forEach( (quooty) => {
        // add all-fields-array match_phrase query for each quoty
        queryHash.bool.must_not.push( QueryHelpers.matchPhraseShouldClause(quooty, searchSet) )
      })
    }
  }

  var titleBox, titleBoxQuoties
  if(customQuery.title && customQuery.title.length > 0){

    // lets get title-oriented
    var titleBoxQueryString = customQuery.title

    queryHash.bool.must ||= []
    if( hasQuoties(titleBoxQueryString) ){
      
      // we're modifying the actual value of the none query here (to remove quoties) so don't store the altered query state in customQuery
       titleBox = extractQuotiesFromSearchbox(titleBoxQueryString)
       titleBoxQueryString = titleBox.query
       titleBoxQuoties = titleBox.quoties
      
      // we add the appropriate quoty search clauses to the bool down at the end
    }

    if(titleBoxQueryString && titleBoxQueryString.length > 0){
      queryHash.bool.must.push( titleQuery(titleBoxQueryString) )
    }
  }

  if(customQuery.startDate || customQuery.endDate){
    queryHash.bool.filter = {
      range: {
        broadcast_date: {}
      }
    }

    if(customQuery.startDate){
      queryHash.bool.filter.range.broadcast_date.gt = customQuery.startDate
    }

    if(customQuery.endDate){
      queryHash.bool.filter.range.broadcast_date.lt = customQuery.endDate
    }
  }

  if(mainBoxQuoties){
    // ooh wee we got da quoties
    queryHash.bool.must ||= []
    mainBoxQuoties.forEach( (quooty) => {
      // add all-fields-array match_phrase query for each quoty

      // each quoty term *must* satisfy its *should*
      // its *should* requires at least one field to match_phrase the quoty term
      queryHash.bool.must.push( QueryHelpers.matchPhraseShouldClause(quooty, searchSet) )
    })
  }

  if(allBoxQuoties){
    queryHash.bool.must ||= []
    allBoxQuoties.forEach( (quooty) => {
      queryHash.bool.must.push( QueryHelpers.matchPhraseShouldClause(quooty, searchSet) )  
    })
  }

  if(titleBoxQuoties){
    queryHash.bool.must ||= []
    titleBoxQuoties.forEach( (quooty) => {
      // same query required for quoties in 'all' box vs 'main' box, so just do the exact same thing
      queryHash.bool.must.push( QueryHelpers.titleQueryExact(quooty) )
    })
  }

  // console.log( 'finishing with qh', query, queryHash )
  // regahdless
  return queryHash
}
